export const MOCK_BRANDS = [
  {
    id: "1",
    name: "ADER ERROR",
    description: "현실과 비현실 사이, 왜곡된 감각의 새로운 언어",
    story:
      "ADER ERROR는 서울을 기반으로 한 크리에이티브 그룹이다. 오류를 미학적 언어로 삼아 패션·아트·공간을 넘나드는 독자적 세계관을 구축한다.",
    keywords: ["Street", "Amekaji"],
    thumbnailUrl:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400",
    visuals: [],
    instagramUrl: "https://instagram.com/adererror",
    websiteUrl: "",
    isManual: false,
  },
  {
    id: "2",
    name: "NORM LAYER",
    description: "단정한 실루엣과 오래 있는 균형",
    story: "노멀레이어는 시간이 지나도 변하지 않는 옷을 만든다.",
    keywords: ["Minimal", "Classic"],
    thumbnailUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    visuals: [],
    instagramUrl: "https://instagram.com/normlayer",
    websiteUrl: "",
    isManual: false,
  },
  {
    id: "3",
    name: "OLDROOM",
    description: "오래 입은 옷의 분위기를 현대적으로 재해석합니다",
    story: "올드룸은 빈티지 감성을 현대적으로 재해석한 브랜드입니다.",
    keywords: ["Vintage", "Workwear"],
    thumbnailUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    visuals: [],
    instagramUrl: "https://instagram.com/oldroom",
    websiteUrl: "",
    isManual: false,
  },
  {
    id: "4",
    name: "NOIR ROUTE",
    description: "도시적인 실루엣과 기능적인 디테일",
    story: "노이르루트는 도시와 자연을 잇는 기능성 패션 브랜드입니다.",
    keywords: ["Techwear", "Street"],
    thumbnailUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
    visuals: [],
    instagramUrl: "https://instagram.com/noirroute",
    websiteUrl: "",
    isManual: false,
  },
  {
    id: "5",
    name: "KIND FRAME",
    description: "담백한 절제와 오래 늘는 소재를 중심으로 전개합니다",
    story: "카인드프레임은 지속 가능한 소재와 절제된 디자인을 추구합니다.",
    keywords: ["Classic", "Minimal"],
    thumbnailUrl:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400",
    visuals: [],
    instagramUrl: "https://instagram.com/kindframe",
    websiteUrl: "",
    isManual: false,
  },
  {
    id: "6",
    name: "MORU",
    description: "절제된 실루엣과 편안한 감각을 제안하는 브랜드",
    story: "모루는 편안함과 스타일을 동시에 추구합니다.",
    keywords: ["Minimal", "Classic"],
    thumbnailUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400",
    visuals: [],
    instagramUrl: "https://instagram.com/moru",
    websiteUrl: "",
    isManual: false,
  },
  {
    id: "7",
    name: "FIELD NOTE",
    description: "아웃도어의 기능과 일상의 균형을 담습니다",
    story: "필드노트는 아웃도어 감성을 일상에 녹여낸 브랜드입니다.",
    keywords: ["Gorpcore", "Workwear"],
    thumbnailUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400",
    visuals: [],
    instagramUrl: "https://instagram.com/fieldnote",
    websiteUrl: "",
    isManual: false,
  },
  {
    id: "8",
    name: "RAW MONDAY",
    description: "거친 질감과 데님을 기반으로 한 일상복",
    story: "로우먼데이는 데님을 중심으로 한 캐주얼 브랜드입니다.",
    keywords: ["Vintage", "Amekaji"],
    thumbnailUrl:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400",
    visuals: [],
    instagramUrl: "https://instagram.com/rawmonday",
    websiteUrl: "",
    isManual: false,
  },
];

export const MOCK_CATEGORIES = [
  {
    id: "all",
    name: "전체",
    brandIds: ["1", "2", "3", "4", "5", "6", "7", "8"],
    isDefault: true,
  },
  { id: "travel", name: "여행", brandIds: ["3", "6", "7"], isDefault: false },
];

export const MOCK_SAVED_BRANDS = [
  { brandId: "1", categoryIds: ["all"], memo: "" },
  { brandId: "2", categoryIds: ["all"], memo: "" },
  {
    brandId: "3",
    categoryIds: ["all", "travel"],
    memo: "가을 여행 스타일링에 좋은 레퍼런스.",
  },
  { brandId: "4", categoryIds: ["all"], memo: "" },
  { brandId: "5", categoryIds: ["all"], memo: "" },
  { brandId: "6", categoryIds: ["all", "travel"], memo: "" },
  { brandId: "7", categoryIds: ["all", "travel"], memo: "" },
  { brandId: "8", categoryIds: ["all"], memo: "다시 데님 라인 체크하기." },
];
