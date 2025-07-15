# frozen_string_literal: true

TopicViewSerializer.class_eval do
  attributes :dice_only, :dice_min, :dice_max

  def dice_only
    object.topic.custom_fields["dice_only"]
  end

  def include_dice_only?
    object.topic.custom_fields.key?("dice_only")
  end

  def dice_min
    object.topic.custom_fields["dice_min"]
  end

  def include_dice_min?
    object.topic.custom_fields.key?("dice_min")
  end

  def dice_max
    object.topic.custom_fields["dice_max"]
  end

  def include_dice_max?
    object.topic.custom_fields.key?("dice_max")
  end
end
