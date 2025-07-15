# frozen_string_literal: true

# name: discourse-dice-comment
# about: Adds dice-only topics with roll button
# version: 0.2
# authors: Codex

enabled_site_setting :dice_comment_enabled


register_asset 'stylesheets/common/dice-comment.scss'

after_initialize do
  require_relative 'lib/discourse_dice_comment/engine'
  require_relative 'config/routes'
  load File.expand_path('app/serializers/topic_view_serializer_extension.rb', __dir__)

  register_topic_custom_field_type('dice_only', :boolean)
  register_topic_custom_field_type('dice_max', :integer)

  DiscourseEvent.on(:topic_created) do |topic, opts, _user|
    Rails.logger.warn("🎯 opts: #{opts.inspect}")
    Rails.logger.warn("🎯 opts[:topic_fields]: #{opts[:topic_fields].inspect}")
    Rails.logger.warn("🎯 dice_only: #{opts.dig(:topic_fields, 'dice_only').inspect}")
    Rails.logger.warn("🎯 dice_max: #{opts.dig(:topic_fields, 'dice_max').inspect}")

    Rails.logger.warn("🎯 topic: #{topic.inspect}")
  
    dice_only = ActiveModel::Type::Boolean.new.cast(opts.dig(:topic_fields, "dice_only"))
    dice_max = opts.dig(:topic_fields, "dice_max").to_i
  
    topic.custom_fields["dice_only"] = dice_only
    topic.custom_fields["dice_max"] = dice_max
    topic.save_custom_fields
  
    Rails.logger.warn("🎯 FINAL FIELDS: #{topic.custom_fields.inspect}")
  end
  
    
  
end
