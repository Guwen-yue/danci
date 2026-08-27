import type { Book, Sentence, Word, WordContent } from 'app/lib/types';

// ---------------------------------------------------------------------------
// 单词书（mock，结构与共享库 book 表一致）
// ---------------------------------------------------------------------------

export const MOCK_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'PEP小学英语三年级上',
    wordCount: 10,
    coverUrl: null,
    bookId: 'PEPXiaoXue3_1',
    tags: '小学,人教版,三年级',
    createdAt: '2026-08-01T08:00:00.000Z',
    updatedAt: '2026-08-20T08:00:00.000Z',
  },
  {
    id: 'b2',
    title: 'PEP小学英语三年级下',
    wordCount: 8,
    coverUrl: null,
    bookId: 'PEPXiaoXue3_2',
    tags: '小学,人教版,三年级',
    createdAt: '2026-08-02T08:00:00.000Z',
    updatedAt: '2026-08-20T08:00:00.000Z',
  },
  {
    id: 'b3',
    title: 'PEP小学英语六年级下',
    wordCount: 12,
    coverUrl: null,
    bookId: 'PEPXiaoXue6_2',
    tags: '小学,人教版,六年级',
    createdAt: '2026-08-03T08:00:00.000Z',
    updatedAt: '2026-08-20T08:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// 单词（mock，content 结构与共享库 words 表一致）
// ---------------------------------------------------------------------------

function makeWord(
  bookId: string,
  wordRank: number,
  headWord: string,
  tranCn: string,
  opts: {
    usphone?: string;
    ukphone?: string;
    tranOther?: string;
    sentence?: Sentence[];
    syno?: WordContent['syno'];
    relWord?: WordContent['relWord'];
    remMethod?: WordContent['remMethod'];
  } = {}
): Word {
  const content: WordContent = {
    usphone: opts.usphone,
    ukphone: opts.ukphone,
    ukspeech: `${headWord}&type=1`,
    usspeech: `${headWord}&type=2`,
    trans: [{ tranCn, tranOther: opts.tranOther }],
    sentence: {
      desc: '例句',
      sentences: opts.sentence ?? [
        { sContent: `I have a ${headWord}.`, sCn: `我有一个${tranCn}。` },
      ],
    },
  };
  if (opts.syno) content.syno = opts.syno;
  if (opts.relWord) content.relWord = opts.relWord;
  if (opts.remMethod) content.remMethod = opts.remMethod;
  return { id: wordRank, wordRank, headWord, content, bookId };
}

const B1 = 'PEPXiaoXue3_1';

export const MOCK_WORDS: Record<string, Word[]> = {
  [B1]: [
    makeWord(B1, 1, 'ruler', '尺子', {
      usphone: "'rulɚ",
      ukphone: "'ruːlə",
      tranOther:
        'a long flat straight piece of plastic, metal, or wood that you use for measuring things or drawing straight lines',
      sentence: [{ sContent: 'a 12-inch ruler', sCn: '一把12英寸的尺子' }],
      syno: {
        desc: '同近',
        synos: [
          {
            pos: 'n',
            tran: '[计量]尺；统治者；[测]划线板，划线的人',
            hwds: [{ w: 'governor' }, { w: 'dominator' }],
          },
        ],
      },
      relWord: {
        desc: '同根',
        rels: [
          {
            pos: 'adj',
            words: [
              { hwd: 'ruling', tran: '统治的；主要的；支配的；流行的，普遍的' },
              { hwd: 'ruled', tran: '有横隔线的；有直线行的；受统治的' },
            ],
          },
          {
            pos: 'n',
            words: [
              { hwd: 'rule', tran: '统治；规则' },
              { hwd: 'ruling', tran: '统治，支配；裁定' },
            ],
          },
        ],
      },
      remMethod: {
        desc: '记忆',
        val: '没有规矩(rule)，不成方圆，尺子(ruler)可以用来规划图形。',
      },
    }),
    makeWord(B1, 2, 'pen', '钢笔', {
      usphone: '/pen/',
      ukphone: '/pen/',
      tranOther: 'an instrument for writing or drawing with ink',
      sentence: [{ sContent: 'This is my new pen.', sCn: '这是我的新钢笔。' }],
    }),
    makeWord(B1, 3, 'pencil', '铅笔', {
      usphone: "'pensl",
      ukphone: "'pensl",
      tranOther: 'a thin wooden instrument with a black or colored lead',
      sentence: [{ sContent: 'I write with a pencil.', sCn: '我用铅笔写字。' }],
      syno: {
        desc: '同近',
        synos: [{ pos: 'n', tran: '铅笔；笔状物', hwds: [{ w: 'pen' }, { w: 'crayon' }] }],
      },
    }),
    makeWord(B1, 4, 'eraser', '橡皮', {
      usphone: "ɪ'reɪzə",
      ukphone: "ɪ'reɪzə",
      tranOther: 'a small piece of rubber used to remove pencil marks',
      sentence: [{ sContent: 'May I borrow your eraser?', sCn: '我能借一下你的橡皮吗？' }],
      remMethod: {
        desc: '记忆',
        val: '把写错的字母擦(erase)掉，就需要一块橡皮擦(eraser)。',
      },
    }),
    makeWord(B1, 5, 'crayon', '蜡笔', {
      usphone: "'kreɪən",
      ukphone: "'kreɪən",
      tranOther: 'a colored stick of wax used for drawing',
      sentence: [{ sContent: 'I color the picture with crayons.', sCn: '我用蜡笔给图画上色。' }],
    }),
    makeWord(B1, 6, 'book', '书', {
      usphone: '/bʊk/',
      ukphone: '/bʊk/',
      tranOther: 'a set of printed pages fastened together inside a cover',
      sentence: [{ sContent: 'Open your book, please.', sCn: '请打开你的书。' }],
      remMethod: {
        desc: '记忆',
        val: '一本书(book)就是装订(bind)起来的文字，记住 b + ook。',
      },
    }),
    makeWord(B1, 7, 'bag', '书包', {
      usphone: '/bæɡ/',
      ukphone: '/bæɡ/',
      tranOther: 'a container made of cloth, leather or plastic for carrying things',
      sentence: [{ sContent: 'My bag is on the desk.', sCn: '我的书包在书桌上。' }],
    }),
    makeWord(B1, 8, 'pencil-case', '铅笔盒', {
      usphone: "'penslkeɪs",
      ukphone: "'penslkeɪs",
      tranOther: 'a small container for pencils and pens',
      sentence: [{ sContent: 'The pencils are in the pencil-case.', sCn: '铅笔在铅笔盒里。' }],
    }),
    makeWord(B1, 9, 'sharpener', '卷笔刀', {
      usphone: "'ʃɑːpnə",
      ukphone: "'ʃɑːpnə",
      tranOther: 'a tool used to make pencils sharp',
      sentence: [{ sContent: 'Sharpen your pencil with the sharpener.', sCn: '用卷笔刀削铅笔。' }],
    }),
    makeWord(B1, 10, 'school', '学校', {
      usphone: '/skuːl/',
      ukphone: '/skuːl/',
      tranOther: 'a place where children go to learn',
      sentence: [{ sContent: 'We go to school by bus.', sCn: '我们坐公交车去上学。' }],
      syno: {
        desc: '同近',
        synos: [{ pos: 'n', tran: '学校；上学', hwds: [{ w: 'college' }, { w: 'academy' }] }],
      },
      remMethod: {
        desc: '记忆',
        val: '学校(school)是学习的地方，s + chool，同学们一起来上学。',
      },
    }),
  ],

  ['PEPXiaoXue3_2']: [
    ['big', '大的', '/bɪɡ/'],
    ['small', '小的', '/smɔːl/'],
    ['long', '长的', '/lɒŋ/'],
    ['short', '短的', '/ʃɔːt/'],
    ['tall', '高的', '/tɔːl/'],
    ['thin', '瘦的', '/θɪn/'],
    ['fat', '胖的', '/fæt/'],
    ['new', '新的', '/njuː/'],
  ].map(([w, cn, ph], i) =>
    makeWord('PEPXiaoXue3_2', i + 1, w as string, cn as string, {
      usphone: ph as string,
      ukphone: ph as string,
      sentence: [{ sContent: `It is ${w}.`, sCn: `它是${cn}的。` }],
    })
  ),

  ['PEPXiaoXue6_2']: [
    ['museum', '博物馆', "/mjuː'ziːəm/"],
    ['library', '图书馆', "'laɪbrəri"],
    ['postcard', '明信片', "'pəʊstkɑːd"],
    ['hotel', '旅馆', "/həʊ'tel/"],
    ['restaurant', '餐馆', "'restrɒnt"],
    ['hospital', '医院', "'hɒspɪtl"],
    ['cinema', '电影院', "'sɪnəmə"],
    ['science', '科学', "'saɪəns"],
    ['moon', '月亮', '/muːn/'],
    ['star', '星星', '/stɑː/'],
    ['earth', '地球', '/ɜːθ/'],
    ['planet', '行星', "'plænɪt"],
  ].map(([w, cn, ph], i) =>
    makeWord('PEPXiaoXue6_2', i + 1, w as string, cn as string, {
      usphone: ph as string,
      ukphone: ph as string,
      sentence: [{ sContent: `We visited the ${w} last weekend.`, sCn: `上周末我们参观了${cn}。` }],
    })
  ),
};

// ---------------------------------------------------------------------------
// 查询辅助
// ---------------------------------------------------------------------------

export function getBook(bookId: string): Book | undefined {
  return MOCK_BOOKS.find((b) => b.bookId === bookId);
}

export function getWords(bookId: string): Word[] {
  return MOCK_WORDS[bookId] ?? [];
}

export function getWord(bookId: string, wordRank: number): Word | undefined {
  return getWords(bookId).find((w) => w.wordRank === wordRank);
}
