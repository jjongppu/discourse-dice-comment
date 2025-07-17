# frozen_string_literal: true

module ::DiscourseDiceComment
  class RollController < ::ApplicationController
    requires_plugin 'discourse-dice-comment'
    before_action :ensure_logged_in

    def create
      Rails.logger.warn("🎲 [DICE] params = #{params.inspect}")

      topic = Topic.find(params[:topic_id])
      raise Discourse::NotFound unless topic.custom_fields["dice_only"]

      Rails.logger.warn("🎲 [DICE] topic_id = #{topic.id}, title = #{topic.title}")
      Rails.logger.warn("🎲 [DICE] topic.custom_fields = #{topic.custom_fields.inspect}")

      min = 0
      max = topic.custom_fields["dice_max"].to_i
      max = 100 if max <= 0

      roll = rand(min..max)
      raw = "🎲 #{roll}! #{current_user.username}님의 운명은!?"

      post = PostCreator.create!(
        current_user,
        topic_id: topic.id,
        raw: raw
      )

      post.custom_fields["is_dice_reply"] = true
      post.save_custom_fields

      render json: success_json
    end
  end
end
