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

  DiscourseEvent.on(:topic_created) do |topic, params, _user|
    topic.custom_fields["dice_only"] = ActiveModel::Type::Boolean.new.cast(params[:dice_only])
    topic.custom_fields["dice_max"] = params[:dice_max]
    topic.save_custom_fields
  end
end
