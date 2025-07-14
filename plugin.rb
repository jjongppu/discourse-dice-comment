# frozen_string_literal: true

# name: discourse-dice-comment
# about: Adds a dice-only custom field to topics
# version: 0.1
# authors: Codex

after_initialize do
  # Store dice_only field when topic is created
  on(:topic_created) do |topic, params, user|
    if params[:dice_only].present?
      topic.custom_fields['dice_only'] = params[:dice_only]
      topic.save_custom_fields
    end
  end

  add_to_serializer(:topic_view, :dice_only) do
    object.topic.custom_fields['dice_only']
  end
  add_to_serializer(:topic_view, :include_dice_only?) do
    object.topic.custom_fields.key?('dice_only')
  end
end
