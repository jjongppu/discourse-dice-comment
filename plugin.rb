# frozen_string_literal: true

# name: discourse-dice-comment
# about: Adds dice-only topics with roll button
# version: 0.2
# authors: Codex

enabled_site_setting :dice_comment_enabled


register_asset 'stylesheets/common/dice-comment.scss'

after_initialize do
  require_relative 'lib/discourse_dice_comment/engine'
  load File.expand_path('app/serializers/topic_view_serializer_extension.rb', __dir__)
  load File.expand_path('app/controllers/discourse_dice_comment/roll_controller.rb', __dir__)

  Discourse::Application.routes.append do
    ::DiscourseDiceComment::Engine.routes.draw do
      post '/roll-dice/:topic_id' => 'roll#create'
    end

    mount ::DiscourseDiceComment::Engine, at: '/dice'
  end

  fields = [
    { name: 'dice_only', type: 'boolean' },
    { name: 'dice_max', type: 'integer' }
  ]

  fields.each do |field|
    register_topic_custom_field_type(field[:name], field[:type])

    add_to_class(:topic, field[:name].to_sym) do
      custom_fields[field[:name]]
    end

    add_to_class(:topic, "#{field[:name]}=") do |value|
      custom_fields[field[:name]] = value
    end

    DiscourseEvent.on(:topic_created) do |topic, opts, user|
      topic.send("#{field[:name]}=", opts[field[:name].to_sym])
      topic.save!
    end

    PostRevisor.track_topic_field(field[:name].to_sym) do |tc, value|
      tc.record_change(field[:name], tc.topic.send(field[:name]), value)
      tc.topic.send("#{field[:name]}=", value.present? ? value : nil)
    end

    add_to_serializer(:topic_view, field[:name].to_sym) do
      object.topic.send(field[:name])
    end

    add_preloaded_topic_list_custom_field(field[:name])

    add_to_serializer(:topic_list_item, field[:name].to_sym) do
      object.send(field[:name])
    end
  end

  
end
