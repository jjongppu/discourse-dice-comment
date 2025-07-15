# frozen_string_literal: true

module ::DiscourseDiceComment
  class RollController < ::ApplicationController
    requires_plugin 'discourse-dice-comment'
    before_action :ensure_logged_in

    def create
      topic = Topic.find(params[:topic_id])
      raise Discourse::NotFound unless topic.custom_fields["dice_only"]

      min = 0
      max = topic.custom_fields["dice_max"].to_i
      max = 100 if max <= 0

      roll = rand(min..max)
      raw = "🎲 #{roll}! #{current_user.username}님의 운명은!?"

      PostCreator.create!(current_user, topic_id: topic.id, raw: raw)

      render json: success_json
    end
  end
end
