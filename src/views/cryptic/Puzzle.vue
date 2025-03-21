<template>
  <div class="cryptic">
    <div v-if="puzzle" class="puzzle-container">
      <h1 class="color-secondary">PUZZLE OF THE DAY</h1>
      <div class="puzzle-prompt" :class="{ 'minimized': hasInteractions }">
        <div class="prompt-header"
             v-if="hasInteractions"
             @click="togglePrompt"
             :class="{ 'expanded': isPromptExpanded }">
          <span>{{ puzzle.title }}</span>
          <button class="toggle-btn">{{ isPromptExpanded ? '▼' : '▶' }}</button>
        </div>
        <div class="prompt-content" v-show="!hasInteractions || isPromptExpanded">
          {{ puzzle.prompt }}
        </div>
      </div>

      <div class="solved-banner" v-if="isSolved">
          <div class="checkmark-container">
            <div class="checkmark">✓</div>
          </div>
          <div class="solved-text">Puzzle Solved!</div>
          <button class="toggle-history-btn" @click="toggleChatHistory">
            {{ isChatHistoryExpanded ? 'Hide History' : 'Show History' }}
          </button>
        </div>

      <div class="chat-container" :class="{ 'minimized': !hasInteractions, 'solved': isSolved }">
        <div v-if="hasInteractions"
             class="chat-messages"
             ref="chatMessages"
             role="log"
             aria-live="polite"
             :class="{ 'expanded': isChatHistoryExpanded }">
          <div v-for="(message, index) in chatHistory"
               :key="index"
               :class="['message', message.type]"
               :aria-label="`${message.type === 'user' ? 'You' : 'System'}: ${message.content}`">
            <div class="message-content">{{ message.content }}</div>
            <div class="message-meta">
              <button
                v-if="message.type === 'user' && !message.hasResponse && message.responseReceived"
                class="resubmit-btn"
                @click="resubmitMessage(message.content)"
                aria-label="Resubmit this message"
              >
                Resubmit
              </button>
            </div>
          </div>
          <div v-if="isTyping" class="message system typing" aria-label="System is typing">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>

        <div class="chat-input" v-if="!isSolved">
          <input
            v-model="userInput"
            @keyup.enter="sendMessage"
            placeholder="What do you do?"
            type="text"
            :disabled="isSolved || isTyping"
          />
          <button @click="sendMessage" :disabled="isSolved || isTyping || !userInput.trim()">
            Send
          </button>
        </div>
      </div>
    </div>
    <div v-else-if="noPuzzle" class="puzzle-container">
      <h1>No Puzzle Today</h1>
      <p>Check back later for today's puzzle!</p>
    </div>
    <div v-else class="loading puzzle-container">
      Loading puzzle...
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import axios from 'axios'

interface Puzzle {
  id: number
  title: string
  prompt: string
  publish_date: string
}

interface ChatMessage {
  type: 'user' | 'system'
  content: string
  hasResponse?: boolean
  responseReceived?: boolean
  timestamp?: string
}

interface PuzzleResponse {
  puzzle: Puzzle
  is_solved: boolean
  solved_ts: string | null
  interactions: {
    input: string
    output: string | null
    is_solved: boolean
    created_ts: string
  }[]
}

const puzzle = ref<Puzzle | null>(null)
const noPuzzle = ref(false)
const chatHistory = ref<ChatMessage[]>([])
const userInput = ref('')
const chatMessages = ref<HTMLElement | null>(null)
const isSolved = ref(false)
const isTyping = ref(false)
const hasInteractions = ref(false)
const isPromptExpanded = ref(false)
const isChatHistoryExpanded = ref(false)
const justSolved = ref(false)

const BASE_ENDPOINT = '/cryptic/puzzles/'


const togglePrompt = () => {
  isPromptExpanded.value = !isPromptExpanded.value
}

const toggleChatHistory = () => {
  isChatHistoryExpanded.value = !isChatHistoryExpanded.value

  // If we're expanding, wait for the transition then scroll
  if (isChatHistoryExpanded.value) {
    // Allow time for the transition to complete before scrolling
    setTimeout(() => {
      scrollToBottom()
    }, 300) // Match this delay with your transition time
  }
}

const fetchDailyPuzzle = async () => {
  try {
    const response = await axios.get<PuzzleResponse>(BASE_ENDPOINT + 'daily/')
    puzzle.value = response.data.puzzle
    isSolved.value = response.data.is_solved
    hasInteractions.value = response.data.interactions.length > 0

    // Initialize chat history with previous interactions
    response.data.interactions.forEach(interaction => {
      // Add user message
      chatHistory.value.push({
        type: 'user',
        content: interaction.input,
        hasResponse: interaction.output !== null && interaction.output !== ''
      })

      // Add system response if it exists
      if (interaction.output) {
        chatHistory.value.push({
          type: 'system',
          content: interaction.output
        })
      }
    })

  } catch (error: any) {
    console.error('Error fetching puzzle:', error)
    if (error.response?.status === 404) {
      noPuzzle.value = true
    }
  }
}

const resubmitMessage = async (message: string) => {
  if (isSolved.value) return;

  isTyping.value = true
  try {
    const response = await axios.post(BASE_ENDPOINT + 'submit/', {
      puzzle_id: puzzle.value?.id,
      input: message
    })

    chatHistory.value.push({
      type: 'system',
      content: response.data.output,
    });

    // Update the hasResponse flag for the original message
    const messageIndex = chatHistory.value.findIndex(
      m => m.type === 'user' && m.content === message && !m.hasResponse
    );
    if (messageIndex !== -1) {
      chatHistory.value[messageIndex].hasResponse = true;
      chatHistory.value[messageIndex].responseReceived = true;
    }

    if (response.data.is_solved) {
      isSolved.value = true;
      justSolved.value = true;
      chatHistory.value.push({
        type: 'system',
        content: 'Puzzle solved!',
      });

      // Reset justSolved after animation completes
      setTimeout(() => {
        justSolved.value = false;
      }, 3000);
    }
  } catch (error) {
    console.error('Error resubmitting message:', error)
    // Add user-facing error message
    chatHistory.value.push({
      type: 'system',
      content: 'Sorry, there was an error processing your message. Please try again.',
    });
  } finally {
    isTyping.value = false
  }

  scrollToBottom()
}

const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight
  }
}

// Add a watch effect to scroll when messages change
watch(chatHistory, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

// Add a watch effect to scroll when typing indicator appears/disappears
watch(isTyping, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

const sendMessage = async () => {
  if (!userInput.value.trim()) return
  if (isSolved.value) return

  hasInteractions.value = true
  const messageContent = userInput.value

  // Add user message to chat
  chatHistory.value.push({
    type: 'user',
    content: messageContent,
    hasResponse: false,
    responseReceived: false,
    timestamp: new Date().toISOString()
  })

  // Clear input immediately after adding message
  userInput.value = ''

  // Scroll after adding user message
  nextTick(() => {
    scrollToBottom()
  })

  isTyping.value = true
  try {
    const response = await axios.post(BASE_ENDPOINT + 'submit/', {
      puzzle_id: puzzle.value?.id,
      input: messageContent
    })

    // Update hasResponse for the user message
    const messageIndex = chatHistory.value.findIndex(
      m => m.type === 'user' && m.content === messageContent
    );
    if (messageIndex !== -1) {
      chatHistory.value[messageIndex].hasResponse = true;
      chatHistory.value[messageIndex].responseReceived = true;
    }

    chatHistory.value.push({
      type: 'system',
      content: response.data.output,
    });

    if (response.data.is_solved) {
      isSolved.value = true;
      justSolved.value = true;
      chatHistory.value.push({
        type: 'system',
        content: 'Puzzle solved!',
      });

      // Reset justSolved after animation completes
      setTimeout(() => {
        justSolved.value = false;
      }, 3000);
    }
  } catch (error) {
    console.error('Error submitting answer:', error)
    // Add user-facing error message
    chatHistory.value.push({
      type: 'system',
      content: 'Sorry, there was an error processing your message. Please try again.',
    });
  } finally {
    isTyping.value = false
  }
}

onMounted(() => {
  fetchDailyPuzzle()
})
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/layout.scss";
@import "@/styles/fonts.scss";

.puzzle-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.puzzle-prompt, .chat-container {
  width: 100%; /* Ensure consistent width */
  box-sizing: border-box; /* Include padding in width calculation */
  margin: 0;
  border-radius: 8px;
}

.puzzle-prompt {
  padding: 20px;
  background-color: #333;
  white-space: pre-wrap;
  transition: all 0.3s ease;

  &.minimized {
    padding: 0;
    cursor: pointer;

    .prompt-header {
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: none;

      .toggle-btn {
        background: none;
        border: none;
        color: #888;
        cursor: pointer;
        font-size: 1.2em;
        padding: 0 8px;

        &:hover {
          color: #fff;
        }
      }
    }

    .prompt-header.expanded {
      border-bottom: 1px solid #444;
    }

    .prompt-content {
      padding: 20px;
      border-top: 1px solid #444;
    }
  }
}

.chat-container {
  border: 1px solid #444;
  overflow: hidden;
  background-color: #222;
  transition: all 0.3s ease;

  &.minimized {
    .chat-messages {
      display: none;
    }
  }

  &.solved {
    border-color: #4caf50;
    transition: all 0.5s ease;

    .chat-messages {
      height: 0;
      max-height: 0;
      padding: 0;
      overflow: hidden;
      transition: all 0.5s ease;
      opacity: 0;

      &.expanded {
        height: auto;
        max-height: 60vh;
        padding: 20px;
        opacity: 1;
        overflow-y: auto;
      }
    }
  }
}

.chat-messages {
  height: 400px;
  max-height: 60vh;
  overflow-y: auto;
  padding: 20px;
  transition: all 0.3s ease;
}

.message {
  position: relative;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
  max-width: 80%;

  .resubmit-btn {
    position: absolute;
    right: 10px;
    bottom: -20px;
    font-size: 0.8em;
    padding: 4px 8px;
    background-color: #666;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #888;
    }
  }

  &.user {
    background-color: #333;
    margin-left: auto;
  }

  &.system {
    background-color: #333;
  }

  &.typing {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    width: fit-content;

    .dot {
      width: 8px;
      height: 8px;
      background-color: #888;
      border-radius: 50%;
      animation: typing 1s infinite ease-in-out;

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #444;

  input {
    flex: 1;
    padding: 8px;
    margin-right: 10px;
    border: 1px solid #444;
    border-radius: 4px;
    background-color: #333;
    color: white;

    &::placeholder {
      color: #888;
    }
  }

  button {
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
}

.no-puzzle {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;

  p {
    color: #888;
    margin-top: 1rem;
  }
}

.solved-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #1e3a29;
  color: white;
  flex-direction: column;
  gap: 10px;

  .checkmark-container {
    width: 60px;
    height: 60px;
    background-color: #4caf50;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pop-in 0.5s ease;
  }

  .checkmark {
    color: white;
    font-size: 32px;
    font-weight: bold;
    transform: scale(0);
    animation: check-scale 0.5s 0.3s forwards;
  }

  .solved-text {
    font-size: 1.5em;
    font-weight: bold;
    animation: fade-in 1s ease;
  }

  .toggle-history-btn {
    margin-top: 10px;
    padding: 6px 12px;
    background-color: rgba(255,255,255,0.2);
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: rgba(255,255,255,0.3);
    }
  }
}

@keyframes pop-in {
  0% {
    transform: scale(0);
  }
  70% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes check-scale {
  0% {
    transform: scale(0);
  }
  70% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>