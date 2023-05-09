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

      <div v-if="review.text">
        <div class="color-text-50">Review:</div>
        <div>{{ review.text }}</div>
      </div>
      <div v-else class="color-text-50">No review written.</div>
      
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

        <button class="btn-small mt-4" @click="claim_review(review)">CLAIM</button>
        
      </div>
      <div v-if="unassigned_reviews.length === 0" class="review mt-4">No unassigned reviews.</div>
    </div>
</div>
</template>

<script lang='ts'>
import { Component, Mixins, Vue } from "vue-property-decorator";
import axios from "axios";
import { FormElement, BUILDER_FORMS } from "@/core/forms";
import { UI_MUTATIONS } from "@/constants";

@Component
export default class WorldFrame extends Vue {

  get user_reviews() {
    return this.$store.state.staff.reviews.user_reviews;
  }

  get unassigned_reviews() { 
    return this.$store.state.staff.reviews.unassigned_reviews;
  }

  async mounted() { 
    this.load_endpoints();
  }

  async load_endpoints() {
    this.$store.dispatch("staff/reviews/load_endpoints");
  }

  async claim_review(review) {
    const endpoint = `/builder/worlds/${review.world.id}/reviews/${review.id}/claim/`;
    await axios.post(endpoint, {});
    this.load_endpoints(); // Reload
  }

  async edit_review(review) {
    const review_field: FormElement = {
      attr: "text",
      label: "Review",
      widget: "textarea",
      default: ""
    };
    const schema = [review_field];
    
    this.$store.commit(UI_MUTATIONS.MODAL_SET, {
      title: "Edit Review",
      data: review,
      schema: schema,
      action: 'staff/reviews/edit_review',
    });
  }

  async approve_review(review) {
    this.$store.dispatch("staff/reviews/approve_review", review)
  }

  async reject_review(review) {
    if (!review.text) {
      this.$store.commit(
        'ui/notification_set_error',
        "You must write a review before rejecting a submission.")
    } else {
      console.log('would reject')
      await this.$store.dispatch("staff/reviews/reject_review", review)
      this.$store.commit('ui/notification_set', "Submission rejected.")
    }
  }

  get schema() {
    return [];
    const review: FormElement = {
      attr: "text",
      label: "Review",
      widget: "textarea",
      default: ""
    };
    return [review];
  }
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