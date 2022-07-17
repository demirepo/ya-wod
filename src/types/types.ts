type Wod = {
  wod: string;
  tr: string;
  tr2: string;
  date: string;
};

interface TrItem {
  def: string;
  ref: { name: string; url: string };
  idiom: boolean;
  labels: string;
  syns: string[];
}

interface Definition {
  text: string;
  tr: TrItem[];
}

interface Translation {
  head: {
    card: boolean;
  };
  "en-ru": { def: Definition[]; regular: [] };
}
