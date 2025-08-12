# frozen_string_literal: true

TopicViewSerializer.class_eval do
  attributes :dice_only, :dice_max, :current_user_has_dice_post

  def dice_only
    object.topic.custom_fields["dice_only"]
  end

  def include_dice_only?
    object.topic.custom_fields.key?("dice_only")
  end

  def dice_max
    object.topic.custom_fields["dice_max"]
  end

  def include_dice_max?
    object.topic.custom_fields.key?("dice_max")
  end

  def current_user_has_dice_post
    user = scope.user
    return false unless user

    PostCustomField
      .joins(:post)
      .where(
        name: "is_dice",
        value: "t",
        posts: { topic_id: object.topic.id, user_id: user.id }
      )
      .exists?
  end

  def include_current_user_has_dice_post?
    scope.user.present?
  end
end
