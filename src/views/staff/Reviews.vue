<template>
  <div>

    <!-- User Review -->
    <div class="review-list">
      <h2>MY REVIEWS</h2>
      <div class="review mt-4"
          v-for="review in user_reviews"
          :key="review.id">
        <div class="world-link mb-4">
          <router-link :to="{ name: 'builder_world_index', params: { world_id: review.world.id } }">{{ review.world.name }}</router-link>
        </div>

        <div class="world-info mb-4">
          <div class="last-updated">
            Last Updated: {{ formatTimestamp(review.world_last_updated) }}
          </div>
          <div class="author">
            By
            <router-link :to="{ name: 'staff_user_info', params: { user_id: review.world_author.id } }">
              {{ review.world_author.name }}
            </router-link>
            <span class="color-text-50 ml-4">[ {{ formatTimestamp(review.world_author.last_login ) }} ]</span>
          </div>
          <div class="builders" v-if="review.world_builders.length">
            Builders:
            <ul class="list">
              <li v-for="builder in review.world_builders" :key="builder.id">
                <router-link
                  :to="{ name: 'staff_user_info', params: { user_id: builder.id } }"
                >
                  {{ builder.name }}
                </router-link>
                <span class="color-text-50 ml-4">[ {{ formatTimestamp(review.world_author.last_login ) }} ]</span>
            </li>
            </ul>
          </div>

        </div>

        <div v-if="review.text">
          <div class="color-text-50">Review:</div>
          <div>{{ review.text }}</div>
        </div>
        <div v-else class="color-text-50">No review written.</div>
        <div class="review-description mt-4">
            {{ review.description }}
          </div>

        <div class="actions mt-4"></div>
        <button class="btn-small mr-2" @click="edit_review(review)">EDIT</button>
        <button class="btn-small mr-2" @click="approve_review(review)">APPROVE</button>
        <button class="btn-small" @click="reject_review(review)">REJECT</button>

      </div>
      <div v-if="user_reviews.length === 0" class="review mt-4">No reviews.</div>
    </div>

      <!-- Unassigned Reviews -->
      <div class="review-list unassigned-reviews">
        <h2>UNASSIGNED REVIEWS</h2>
        <div class="review mt-4"
            v-for="review in unassigned_reviews"
            :key="review.id">

          <div class="world-link">
            <router-link :to="{ name: 'builder_world_index', params: { world_id: review.world.id } }">{{ review.world.name }}</router-link>
          </div>
          <div class="review-description mt-4">
            {{ review.description }}
          </div>

          <button class="btn-small mt-4" @click="claim_review(review)">CLAIM</button>

        </div>
        <div v-if="unassigned_reviews.length === 0" class="review mt-4">No unassigned reviews.</div>
      </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import { FormElement, } from "@/core/forms";

const store = useStore();

const user_reviews = computed(() => store.state.staff.reviews.user_reviews);
const unassigned_reviews = computed(() => store.state.staff.reviews.unassigned_reviews);
const load_endpoints = () => store.dispatch("staff/reviews/load_endpoints");

onMounted(() => {
  load_endpoints();
});

const claim_review = async (review) => {
  const endpoint = `/builder/worlds/${review.world.id}/reviews/${review.id}/claim/`;
  await axios.post(endpoint, {});
  load_endpoints(); // Reload
};

const edit_review = async (review) => {
  const review_field: FormElement = {
    attr: "text",
    label: "Review",
    widget: "textarea",
    default: ""
  };
  const schema = [review_field];

  store.commit('ui/modal/open_form', {
    title: "Edit Review",
    data: review,
    schema: schema,
    action: 'staff/reviews/edit_review',
  });
};

const approve_review = (review) => {
  store.dispatch("staff/reviews/approve_review", review);
};

const reject_review = async (review) => {
  if (!review.text) {
    store.commit('ui/notification_set_error', "You must write a review before rejecting a submission.");
  } else {
    await store.dispatch("staff/reviews/reject_review", review);
    store.commit('ui/notification_set', "Submission rejected.");
  }
};

function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);

    const month = date.getUTCMonth() + 1; // getUTCMonth() returns 0-based month
    const day = date.getUTCDate();
    const year = date.getUTCFullYear().toString().slice(-2); // Get last 2 digits of the year

    return `${month}/${day}/${year}`;
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.review-list {
  max-width: 600px;
  &.unassigned-reviews {
    margin-top: 4rem;
  }

  .review {
    border-top: 1px solid $color-text-hex-30;
    padding-top: 1rem;
  }
}
</style>