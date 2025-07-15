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

  DiscourseEvent.on(:topic_created) do |topic, opts, user|
    # 이게 핵심이야
    dice_only = opts[:dice_only]
    dice_max = opts[:dice_max]
  
    # 또는 이런 식으로도 가능
    # dice_only = opts.dig(:topic_fields, "dice_only")
  
    topic.custom_fields["dice_only"] = ActiveModel::Type::Boolean.new.cast(dice_only)
    topic.custom_fields["dice_max"] = dice_max.to_i
    topic.save_custom_fields
  
    Rails.logger.warn("🎯 FINAL FIELDS: #{topic.custom_fields.inspect}")
  end
    
  
end
