# frozen_string_literal: true

# name: discourse-dice-comment
# about: Adds dice-only topics with roll button
# version: 0.2
# authors: Codex

after_initialize do
  # Store dice fields when topic is created
  on(:topic_created) do |topic, params, user|
    if params[:dice_only].present?
      topic.custom_fields['dice_only'] = params[:dice_only]
      topic.custom_fields['dice_min'] = params[:dice_min]
      topic.custom_fields['dice_max'] = params[:dice_max]
      topic.save_custom_fields
    end
  end

  module ::DiscourseDiceComment
    class Engine < ::Rails::Engine
      engine_name "discourse_dice_comment"
      isolate_namespace DiscourseDiceComment
    end
  end

  require_relative 'config/routes'

  class ::DiscourseDiceComment::RollController < ::ApplicationController
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

  add_to_serializer(:topic_view, :dice_only) { object.topic.custom_fields['dice_only'] }
  add_to_serializer(:topic_view, :include_dice_only?) { object.topic.custom_fields.key?('dice_only') }
  add_to_serializer(:topic_view, :dice_min) { object.topic.custom_fields['dice_min'] }
  add_to_serializer(:topic_view, :include_dice_min?) { object.topic.custom_fields.key?('dice_min') }
  add_to_serializer(:topic_view, :dice_max) { object.topic.custom_fields['dice_max'] }
  add_to_serializer(:topic_view, :include_dice_max?) { object.topic.custom_fields.key?('dice_max') }
end
