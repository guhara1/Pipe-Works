// 수동 보충 읍·면·동 — 자동 데이터셋에 누락된 지역을 손으로 채운다.
// (청주시는 2014년 2구→4구 재편됐으나 법정동 데이터셋이 옛 상당/흥덕 기준이라
//  서원구·청원구 주요 지역이 빠져 있어 보충)
import type { EmdEntry } from "./eupmyeondong.generated";

export const eupmyeondongManual: Record<string, EmdEntry[]> = {
  "충북|청주시 서원구": [
    { n: "산남동", s: "sannam-dong" },
    { n: "분평동", s: "bunpyeong-dong" },
    { n: "수곡동", s: "sugok-dong" },
    { n: "사창동", s: "sachang-dong" },
    { n: "사직동", s: "sajik-dong" },
    { n: "모충동", s: "mochung-dong" },
    { n: "성화동", s: "seonghwa-dong" },
    { n: "개신동", s: "gaesin-dong" },
    { n: "죽림동", s: "jungnim-dong" },
    { n: "미평동", s: "mipyeong-dong" },
    { n: "남이면", s: "nami-myeon" },
    { n: "현도면", s: "hyeondo-myeon" },
  ],
  "충북|청주시 청원구": [
    { n: "율량동", s: "yullyang-dong" },
    { n: "사천동", s: "sacheon-dong" },
    { n: "내덕동", s: "naedeok-dong" },
    { n: "우암동", s: "uam-dong" },
    { n: "주성동", s: "juseong-dong" },
    { n: "정상동", s: "jeongsang-dong" },
    { n: "정북동", s: "jeongbuk-dong" },
    { n: "오근장동", s: "ogeunjang-dong" },
    { n: "오창읍", s: "ochang-eup" },
    { n: "내수읍", s: "naesu-eup" },
    { n: "북이면", s: "bugi-myeon" },
  ],
};
