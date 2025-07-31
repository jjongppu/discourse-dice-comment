# frozen_string_literal: true

module ::DiscourseDiceComment
  class RollController < ::ApplicationController
    requires_plugin 'discourse-dice-comment'
    skip_before_action :check_xhr
    skip_before_action :verify_authenticity_token
    before_action :ensure_logged_in

    def create
      topic = Topic.find(params[:topic_id])
      raise Discourse::NotFound unless topic.custom_fields["dice_only"]

      min = 0
      max = topic.custom_fields["dice_max"].to_i
      max = 100 if max <= 0

      roll = rand(min..max)

      sound_effects = [
        "딸그랑!", "데구르르르...", "또르르르르...", "차르르륵!", "찰칵!", "탁!", "또르르... 뙇!", "슉! 똭!", "와장창! … 딱!"
      ]

      sound = sound_effects.sample
      special_msg = ""

      if roll == min
        special_msg = " 😢 최저값..."
      elsif roll == max
        special_msg = " 🎉 최고값!!"
      elsif roll == 77
        special_msg = " ✨ 럭키 세븐!!"
      end

      raw = "🎲 #{sound} **#{roll}!**  #{special_msg}"

      post = PostCreator.create!(
        current_user,
        topic_id: topic.id,
        raw: raw,
        custom_fields: {
          is_dice: true,
          dice_value: roll.to_s
        }
      )

      render json: success_json.merge(raw: raw, roll: roll)
    end
  end
end
