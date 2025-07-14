# frozen_string_literal: true

DiscourseDiceComment::Engine.routes.draw do
  post '/roll-dice/:topic_id' => 'roll#create'
end

Discourse::Application.routes.append do
  mount ::DiscourseDiceComment::Engine, at: '/dice'
end
