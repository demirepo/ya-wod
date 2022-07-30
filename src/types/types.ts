type Wod = {
  wod: string;
  tr: string;
  tr2: string;
  date: string;
};

interface Translation {
  head: {
    card?: boolean;
  };
  'en-ru': { def?: Definition[]; regular: Regular[] };
  en: { syn: any[]; deriv: any[]; ant: any[] };
}

interface Definition {
  text: string;
  tr: DefItem[];
}

interface Regular {
  text: string;
  pos: Pos;
  ts: string;
  prdg: {
    irreg: boolean;
    data: any[];
  };
  tr: RegularTr;
}

interface RegularTr {
  text: string;
  pos: Pos;
  gen: Pos;
  fr: number;
  syn?: RegularTr;
  mean?: { text: string }[];
  ex?: Example[];
}

interface Example {
  text: string;
  tr: { text: string }[];
}

interface Pos {
  code: string;
  text: string;
  tooltip: string;
}

interface DefItem {
  def: string;
  ref: { name: string; url: string };
  idiom: boolean;
  labels: string;
  syns: string[];
}
