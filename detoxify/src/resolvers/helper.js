export function stripHTMLAndEmojis(input) {
  // Remove HTML tags
  let stripped = input.replace(/<\/?[^>]+(>|$)/g, "");

  // Remove emojis using a Unicode range regex
  stripped = stripped.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF][\uDC00-\uDFFF]|\uFE0F|\u200D|\u2B50|\u23CF|\u2934|\u2935|\u3030|\u2B06|\u2B07|\u2B05|\u2B95|\u2B1B|\u2B1C|\u25B6|\u25C0|\u23E9|\u23EA|\u23ED|\u23EE|\u23EF|\u23F3|\u23F8-\u23FA|\u2194-\u2199|\u21A9|\u21AA|\u2139|\u2328|\u2600-\u26FF|\u2700-\u27BF|\u1F000-\u1F6FF|\u1F700-\u1F77F|\u1F780-\u1F7FF|\u1F800-\u1F8FF|\u1F900-\u1F9FF|\u1FA70-\u1FAFF|\u1FC00-\u1FCFF|\u1FD00-\u1FDFF|\u1FE00-\u1FEFF|\u1FF00-\u1FFFF])/g, "");

  return stripped.trim();
}
