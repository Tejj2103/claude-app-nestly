import home from "@/assets/images/image.png";
import search from "@/assets/images/search.png";
import heart from "@/assets/images/heart.png";
import user from "@/assets/images/user.png";


export const icons = {
  home,
  search,
  heart,
  user,
} as const;

export type IconKey = keyof typeof icons;
