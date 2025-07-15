# frozen_string_literal: true

module ::DiscourseDiceComment
  class RollController < ::ApplicationController
    requires_plugin 'discourse-dice-comment'
    before_action :ensure_logged_in

    def create
      topic = Topic.find(params[:topic_id])
      raise Discourse::NotFound unless topic.custom_fields['dice_only']

      min = topic.custom_fields['dice_min'].to_i
      max = topic.custom_fields['dice_max'].to_i
      min = 0 if min < 0
      max = 100 if max <= 0 || max < min

      roll = rand(min..max)
      raw = "\u{1F3B2} #{roll}! #{current_user.username}\uB2D8\uC758 \uC6B4\uBA85\uC740!?"
      PostCreator.create!(current_user, topic_id: topic.id, raw: raw)

      render json: success_json
    end
  end
end
