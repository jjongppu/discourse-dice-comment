# frozen_string_literal: true

TopicViewSerializer.class_eval do
  attributes :dice_only, :dice_min, :dice_max

  def dice_only
    object.topic.custom_fields['dice_only']
  end

  def dice_min
    object.topic.custom_fields['dice_min']
  end

  def dice_max
    object.topic.custom_fields['dice_max']
  end
end
