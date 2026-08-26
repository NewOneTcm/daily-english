// B2 阅读题库（雅思式：一篇短文 + 若干问题）
// 每个条目：
//   t: "读"    cn/en: 任务说明
//   passage: 短文
//   qs: 问题数组，type 支持 "tf"（判断题 True/False/Not Given）、"mc"（单选）、"sa"（简答）
//       tf:  a 为 "T"/"F"/"NG"；mc:  a 为正确选项下标，opts 为选项数组；sa:  a 为参考答案文本
//       why: 答案解析/原文依据（可选，建议都写）
window.B2_READING = [
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题（判断 · 单选 · 简答）", en: "Read the passage and answer the questions.",
    passage: "Last year, a software company in London tried something bold: it moved all 120 employees to a four-day week, with the same pay. Most people expected productivity to fall. Instead, revenue rose by 12 percent. How? Meetings were cut in half, and email checking was limited to two short windows a day. Staff said they got the same amount of work done in fewer, more focused hours. Not everyone was convinced. Some clients complained that replies were slower on Fridays, the day everyone had off. And managers admitted the model works better for desk jobs than for shops or hospitals, where someone has to be present. Still, nearly all employees said they would never go back to five days, and the company has now made the change permanent.",
    qs: [
      { type: "tf", q: "The company cut employees' pay when it moved to a four-day week.", a: "F", why: "原文明确说 with the same pay，工资没降。" },
      { type: "tf", q: "Revenue increased after the change.", a: "T", why: "revenue rose by 12 percent。" },
      { type: "tf", q: "All clients were happy with the new arrangement.", a: "F", why: "Some clients complained that replies were slower on Fridays。" },
      { type: "mc", q: "According to the managers, the four-day model is least suitable for:", opts: ["A. desk jobs", "B. software companies", "C. shops and hospitals", "D. small teams"], a: 2, why: "managers admitted the model works better for desk jobs than for shops or hospitals, where someone has to be present。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "You do not need to be told that you check your phone too often. You already know. The question is why knowing changes nothing. Behavioural scientists point to 'variable rewards': most of the time the phone offers nothing, but occasionally it offers a message from someone you like, and that unpredictability is exactly what keeps us hooked — the same mechanism behind slot machines. One study found that the average person touches their phone more than two thousand times a day. The fix, experts argue, is not willpower but design: moving apps off the home screen, turning off non-essential notifications, and, most effective of all, keeping the phone in another room while you work.",
    qs: [
      { type: "tf", q: "The text says most people are unaware that they use their phone too much.", a: "F", why: "You already know —— 人们其实清楚，只是知道了也没用。" },
      { type: "tf", q: "Variable rewards make the phone similar to a slot machine.", a: "T", why: "the same mechanism behind slot machines。" },
      { type: "mc", q: "According to one study, the average person touches their phone roughly:", opts: ["A. 200 times a day", "B. 500 times a day", "C. over 2,000 times a day", "D. over 5,000 times a day"], a: 2, why: "more than two thousand times a day。" },
      { type: "sa", q: "What do experts say is the single most effective fix?", a: "Keeping the phone in another room while you work.", why: "most effective of all 后面的内容。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "In an age of instant everything, a quiet movement is pushing back. 'Slow cities', known by the Italian name Cittaslow, began in 1999 and now includes more than two hundred small towns. Members promise to protect local food, reduce traffic, and keep out the kind of fast-food chains that make every high street look identical. Critics call the movement nostalgic, even elitist — most people cannot choose to live in a pretty town with a weekly market. But supporters argue the point is not to turn back the clock; it is to show that a place can value quality of life over speed, and that convenience is not the same thing as happiness.",
    qs: [
      { type: "tf", q: "The Cittaslow movement started in 1999.", a: "T", why: "began in 1999。" },
      { type: "tf", q: "All member towns have banned cars completely.", a: "F", why: "原文是 reduce traffic（减少交通），不是全面禁车。" },
      { type: "mc", q: "Critics believe the movement is:", opts: ["A. too commercial", "B. nostalgic and elitist", "C. growing too fast", "D. bad for local food"], a: 1, why: "Critics call the movement nostalgic, even elitist。" },
      { type: "sa", q: "According to supporters, what is the real point of the movement?", a: "To show that a place can value quality of life over speed, and that convenience is not the same as happiness.", why: "定位 supporters argue the point is not... it is..." },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The office coffee machine is where decisions get made, the saying goes, and remote work may be quietly killing it. When everyone is online, communication becomes scheduled and transactional: you message a colleague only when you need something. The informal conversations — the five-minute chat that surfaces a problem before it becomes a crisis — disappear. Some companies are responding by making the office a place for connection rather than concentration: quiet work happens at home, while the one or two days in the office are reserved for meetings, lunches, and the unplanned encounters that no video call can reproduce.",
    qs: [
      { type: "tf", q: "The author believes the office coffee machine is more important than the work itself.", a: "F", why: "文中并无此比较，属于无中生有。" },
      { type: "tf", q: "Remote communication tends to become scheduled and transactional.", a: "T", why: "communication becomes scheduled and transactional。" },
      { type: "mc", q: "Some companies now use the office mainly for:", opts: ["A. quiet, focused work", "B. connection and meetings", "C. reducing costs", "D. training new staff"], a: 1, why: "the office a place for connection rather than concentration。" },
      { type: "sa", q: "What disappears when everyone works online?", a: "The informal conversations that surface problems before they become crises.", why: "The informal conversations ... disappear。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The brain does not multitask; it switches. Each time you move between tasks, there is a small cost — a fraction of a second to reload your place — and over a day these fractions add up. Researchers call this the 'switch cost', and the more complex the tasks, the higher it climbs. In one experiment, students who thought they were doing two things at once were actually just switching rapidly between them, and both tasks suffered. The uncomfortable conclusion: people who describe themselves as great multitaskers are often the worst at it, precisely because they do not notice how much they are losing.",
    qs: [
      { type: "tf", q: "The brain can genuinely do two tasks at the same time.", a: "F", why: "The brain does not multitask; it switches。" },
      { type: "tf", q: "The switch cost is higher for simpler tasks.", a: "F", why: "the more complex the tasks, the higher it climbs。" },
      { type: "mc", q: "The study found that students who multitasked:", opts: ["A. finished faster", "B. performed worse on both tasks", "C. improved one task", "D. felt more relaxed"], a: 1, why: "both tasks suffered。" },
      { type: "sa", q: "Why are self-described great multitaskers often the worst at it?", a: "Because they do not notice how much they are losing.", why: "precisely because they do not notice how much they are losing。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Buying secondhand used to carry a slight shame; today it carries a hashtag. Platforms that let people resell clothes, furniture and electronics have turned 'pre-loved' into big business, driven mostly by younger shoppers who care about both the environment and their budget. The fashion industry is one of the world's biggest polluters, and every reused item avoids the resources of making a new one. Yet even secondhand has a dark side: the speed with which people buy and resell 'hauls' can still encourage overconsumption, just at a lower price. As one critic put it, renting a dress for one night is greener, but it is still a dress you did not need.",
    qs: [
      { type: "tf", q: "Secondhand shopping used to be socially embarrassing.", a: "T", why: "used to carry a slight shame。" },
      { type: "tf", q: "Secondhand shopping is driven mainly by older shoppers.", a: "F", why: "driven mostly by younger shoppers。" },
      { type: "mc", q: "The fashion industry is described as:", opts: ["A. one of the world's biggest polluters", "B. mostly sustainable", "C. shrinking quickly", "D. fully regulated"], a: 0, why: "one of the world's biggest polluters。" },
      { type: "sa", q: "What is the 'dark side' of secondhand shopping mentioned in the text?", a: "The speed of buying and reselling can still encourage overconsumption, just at a lower price.", why: "Yet even secondhand has a dark side 后一句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Not long ago, bragging about how little you slept was a badge of hard work. Executives boasted of four-hour nights the way athletes boast of medals. That has reversed. Today, eight hours of sleep is a sign of discipline, self-respect and even status — the kind of thing only someone in control of their schedule can afford. Wearable devices have turned sleep into a score to be optimised, and 'sleep hygiene' has become a billion-dollar industry of apps, mattresses and blackout curtains. Whether we actually sleep better is unclear; what is clear is that we now treat sleep as something to perform.",
    qs: [
      { type: "tf", q: "In the past, little sleep was seen as a sign of hard work.", a: "T", why: "bragging about how little you slept was a badge of hard work。" },
      { type: "tf", q: "Wearable devices prove that people are now sleeping better.", a: "F", why: "Whether we actually sleep better is unclear。" },
      { type: "mc", q: "Today, eight hours of sleep is associated with:", opts: ["A. laziness", "B. discipline and status", "C. weakness", "D. old age"], a: 1, why: "a sign of discipline, self-respect and even status。" },
      { type: "sa", q: "What does the author mean by 'treat sleep as something to perform'?", a: "Sleep has become a score to be optimised and shown off, rather than simply rest.", why: "结合前文 sleep as a score to be optimised。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Every autumn, libraries across the country report the same small miracle: thousands of overdue books returned in a single week, no questions asked. These 'amnesty weeks' began as a practical fix — fines were supposed to encourage returns, but they did the opposite. People who owed money simply stopped coming, and the books stayed lost. When fines are cancelled, shame disappears and the books come back. Some libraries have gone further and abolished late fees entirely, arguing that the fee system punished exactly the people who could least afford it. Revenue dropped by less than two percent, while membership actually grew. It turns out the threat of a fine was never what brought books back. Guilt did not work; forgiveness did.",
    qs: [
      { type: "tf", q: "Fines were effective at getting overdue books returned.", a: "F", why: "they did the opposite —— 罚款反而让人不再来还书。" },
      { type: "tf", q: "All libraries have now abolished late fees.", a: "NG", why: "原文只说 Some libraries 废除了罚款，不是全部。" },
      { type: "mc", q: "After fees were abolished, membership:", opts: ["A. fell sharply", "B. stayed the same", "C. grew", "D. became free"], a: 2, why: "membership actually grew。" },
      { type: "sa", q: "Why did people stop coming to the library when they owed fines?", a: "Because the fines made them feel ashamed, so they avoided the library and kept the books.", why: "shame disappears and the books come back 的反推。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "A supermarket chain recently removed all the small sweets and chocolate bars from its checkout lanes, replacing them with fruit and nuts. The goal was to cut 'impulse buys' — the items you never planned to purchase but grab while waiting to pay. Sales of sweets at the checkout fell by three quarters, as expected. What surprised the company was that overall sweet sales barely changed. Customers simply bought chocolate elsewhere in the store, often in larger family packs that worked out cheaper per bar. Psychologists call this the 'licensing effect': having resisted one temptation, shoppers felt they had earned a reward later. The checkout experiment is now cited in debates about whether nudging people actually changes behaviour, or just moves it down the aisle.",
    qs: [
      { type: "tf", q: "Checkout sweet sales dropped by about 75%.", a: "T", why: "Sales of sweets at the checkout fell by three quarters。" },
      { type: "tf", q: "Total sweet sales in the store fell dramatically.", a: "F", why: "overall sweet sales barely changed。" },
      { type: "mc", q: "The 'licensing effect' means people:", opts: ["A. buy more at the checkout", "B. reward themselves after resisting a temptation", "C. prefer fruit to chocolate", "D. avoid family packs"], a: 1, why: "having resisted one temptation, shoppers felt they had earned a reward later。" },
      { type: "sa", q: "What question does the experiment raise about 'nudging'?", a: "Whether nudging actually changes behaviour or just moves it elsewhere.", why: "whether nudging people actually changes behaviour, or just moves it down the aisle。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "In 2018, a city in the Netherlands tried paving some of its bus stop roofs with plants. The 'green roofs' were meant to absorb rainwater, cool the shelters in summer, and give urban bees somewhere to feed. Maintenance costs turned out to be lower than expected — the sedum plants used need no watering once established. But the real surprise came from surveys: people waiting at green-roofed stops reported feeling less stressed and more patient than those at ordinary stops, even though most had not consciously noticed the plants above their heads. The city has since expanded the programme, and urban planners elsewhere are watching. Sometimes the smallest patch of green, placed exactly where people are forced to pause, does more than a distant park.",
    qs: [
      { type: "tf", q: "The green roofs were mainly designed to feed bees.", a: "F", why: "原文列了三个目的（吸水、降温、喂蜂），没有说喂蜂是主要目的；注意 mainly 是陷阱。" },
      { type: "tf", q: "The sedum plants require frequent watering.", a: "F", why: "need no watering once established。" },
      { type: "mc", q: "What did the surveys reveal?", opts: ["A. People disliked the plants", "B. People noticed the roofs immediately", "C. People felt calmer even without noticing the plants", "D. People wanted more bus stops"], a: 2, why: "feeling less stressed and more patient ... even though most had not consciously noticed the plants。" },
      { type: "sa", q: "Why does the author say a small patch of green can do more than a distant park?", a: "Because it is placed exactly where people are forced to pause, so they actually experience it.", why: "定位末句 placed exactly where people are forced to pause。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "When translators work on a novel, they face a choice with every joke, proverb and food name: bring the reader to the culture, or bring the culture to the reader. The first approach keeps foreign words and strange customs, trusting the reader to adjust; the second quietly replaces them with familiar equivalents. A famous example is the Japanese novel whose rice balls became 'jelly doughnuts' in one English edition — readers understood instantly, but something essential was lost. Modern taste has shifted towards keeping the original flavour, helped by the internet: readers can now look up an unfamiliar dish in seconds. The translator's job, one practitioner said, is not to hide the foreignness but to make sure it feels like discovery rather than homework.",
    qs: [
      { type: "tf", q: "The two translation approaches are equally popular today.", a: "NG", why: "原文说现代口味转向保留原味，但没说两者如今同样流行。" },
      { type: "tf", q: "Rice balls were translated as 'jelly doughnuts' in one English edition.", a: "T", why: "原文直接举例。" },
      { type: "mc", q: "What has helped the shift towards keeping original terms?", opts: ["A. Stricter publishing rules", "B. The internet, which lets readers look things up quickly", "C. Falling book prices", "D. Language courses"], a: 1, why: "helped by the internet: readers can now look up an unfamiliar dish in seconds。" },
      { type: "sa", q: "What should foreignness feel like, according to the practitioner?", a: "It should feel like discovery rather than homework.", why: "末句 to make sure it feels like discovery rather than homework。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "A small bakery in Copenhagen opens at five in the morning, and by seven there is a queue down the street. The owner refuses to expand, sell online, or open a second branch. Economists would call this irrational: demand clearly exceeds supply, and money is being left on the table. Her answer is that the business is not the bread but the mornings — she knows her regulars by name, and expansion would turn neighbours into customers. Sociologists have a term for what she is protecting: a 'third place', neither home nor work, where community quietly forms. The queue, in this view, is not inefficiency. It is the point. People are not waiting for bread; they are waiting in a place where waiting together is normal, and that is rarer than good pastry.",
    qs: [
      { type: "tf", q: "The bakery opens a second branch in another city.", a: "F", why: "The owner refuses to ... open a second branch。" },
      { type: "tf", q: "Economists consider her decision irrational.", a: "T", why: "Economists would call this irrational。" },
      { type: "mc", q: "A 'third place' is:", opts: ["A. a third bakery branch", "B. a place that is neither home nor work, where community forms", "C. an online shop", "D. a queue outside a shop"], a: 1, why: "neither home nor work, where community quietly forms。" },
      { type: "sa", q: "According to the author, why is the queue 'the point'?", a: "Because waiting together in a shared place is itself what builds community — people are not just waiting for bread.", why: "末三句 The queue ... is the point ... waiting together is normal。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "For decades, career advice followed a simple formula: find your passion, then find a job that matches it. Psychologists who study motivation now call this backwards. Passion, their research suggests, is rarely discovered; it is developed. People who start with curiosity about a field and stay through the boring early years report growing attached to work they once felt neutral about. Meanwhile, those who hunted for a pre-existing passion often hopped between jobs, interpreting every difficult week as proof they had chosen wrong. The researchers' advice sounds almost old-fashioned: pick something reasonably interesting, get good at it, and let passion catch up. Mastery, it turns out, is a more reliable source of love than love is of mastery.",
    qs: [
      { type: "tf", q: "Traditional career advice said passion should come before the job.", a: "T", why: "find your passion, then find a job that matches it。" },
      { type: "tf", q: "Passion-hunters tended to stay longer in each job.", a: "F", why: "those who hunted for a pre-existing passion often hopped between jobs。" },
      { type: "mc", q: "According to the research, passion usually comes from:", opts: ["A. personality tests", "B. childhood dreams", "C. staying with a field through its boring early years", "D. changing jobs frequently"], a: 2, why: "stay through the boring early years report growing attached。" },
      { type: "sa", q: "What does the final sentence mean?", a: "Becoming good at something is a more reliable way to come to love it than starting from love.", why: "Mastery is a more reliable source of love than love is of mastery。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Museums have a storage problem the public never sees. For every painting on the wall, there may be twenty in the basement — some too fragile to display, many simply out of fashion. One museum in Rotterdam decided to make the storage itself the attraction: a mirrored warehouse where visitors walk among racks of uncovered works, watching conservators repair frames through glass. The gamble was that process would be as interesting as product. Attendance figures suggest it paid off, and curators report an unexpected benefit: visitors who have seen a painting mid-restoration, cracks and all, look at finished works differently. They stop asking what a painting is worth and start asking what it took to survive.",
    qs: [
      { type: "tf", q: "Most of the museum's collection is normally on display.", a: "F", why: "For every painting on the wall, there may be twenty in the basement。" },
      { type: "tf", q: "The Rotterdam warehouse experiment failed to attract visitors.", a: "F", why: "Attendance figures suggest it paid off。" },
      { type: "mc", q: "Visitors watched conservators through:", opts: ["A. television screens", "B. glass", "C. mirrors only", "D. guided headphones"], a: 1, why: "watching conservators repair frames through glass。" },
      { type: "sa", q: "How did visitors' questions change after seeing restoration work?", a: "They stopped asking what a painting is worth and started asking what it took to survive.", why: "末段 stop asking ... start asking ... 原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The spreadsheet was supposed to kill the accountant. When VisiCalc appeared in 1979, commentators predicted the end of the profession: why hire someone to calculate when software calculates instantly? Forty years later there are more accountants than ever, but they do different work. The software ate the arithmetic, and humans moved up the menu — into judgement, negotiation, and the awkward conversations about what the numbers mean. Economists call this pattern 'automation of tasks, not jobs'. The lesson repeats across industries: ATMs did not eliminate bank clerks, they changed them into salespeople and advisers. The safest career bet, then, is not avoiding technology but practising the parts of your job that software makes more valuable, not less.",
    qs: [
      { type: "tf", q: "VisiCalc appeared in 1979.", a: "T", why: "When VisiCalc appeared in 1979。" },
      { type: "tf", q: "There are fewer accountants today than in 1979.", a: "F", why: "Forty years later there are more accountants than ever。" },
      { type: "mc", q: "ATMs changed bank clerks into:", opts: ["A. unemployed workers", "B. software engineers", "C. salespeople and advisers", "D. security guards"], a: 2, why: "they changed them into salespeople and advisers。" },
      { type: "sa", q: "What is the author's career advice?", a: "Do not avoid technology; practise the parts of your job that software makes more valuable.", why: "末句 The safest career bet ... not avoiding technology but practising...。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Every language keeps a few words that refuse to be translated, and 'saudade' is Portuguese's famous prisoner. It names a longing for something absent — a person, a place, a version of yourself — mixed with the strange pleasure of remembering it. English needs a whole clause to circle the idea; Portuguese carries it in three syllables. Linguists argue about how much such words shape thought. The strong claim, that language imprisons perception, has largely been abandoned. But a softer version survives: a language's vocabulary is a map of what its speakers have needed to say often, over centuries. Untranslatable words are therefore less like walls than like monuments — proof of what a culture has loved, lost, and talked about ever since.",
    qs: [
      { type: "tf", q: "'Saudade' contains an element of pleasure.", a: "T", why: "mixed with the strange pleasure of remembering it。" },
      { type: "tf", q: "Linguists still believe language strictly determines perception.", a: "F", why: "The strong claim ... has largely been abandoned。" },
      { type: "mc", q: "The author compares untranslatable words to:", opts: ["A. walls", "B. prisons", "C. monuments", "D. maps"], a: 2, why: "less like walls than like monuments；maps 是形容 vocabulary 的，属于干扰项。" },
      { type: "sa", q: "According to the softer claim, what does a language's vocabulary reveal?", a: "It is a map of what its speakers have needed to say often over centuries.", why: "a language's vocabulary is a map of what its speakers have needed to say often。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "A village in the Alps faced a choice familiar across mountain Europe: young people leaving, shops closing, the school down to a dozen pupils. Instead of chasing tourists, the mayor tried something quieter — he offered cheap, renovated houses to remote workers, on one condition: they had to join a local association, choir, fire brigade or football club. Five years on, forty newcomers have arrived, the school has reopened a classroom, and the bakery has a second oven. The experiment is small and its lessons contested; some families left after a winter, finding the silence harder than the commute they escaped. But the core insight travels well: a place does not need to offer a career, only a life — and a reason to stay past the first snow.",
    qs: [
      { type: "tf", q: "The village's main strategy was to attract tourists.", a: "F", why: "Instead of chasing tourists, the mayor tried something quieter。" },
      { type: "tf", q: "Every newcomer family stayed permanently.", a: "F", why: "some families left after a winter。" },
      { type: "mc", q: "To get a cheap house, remote workers had to:", opts: ["A. work for the mayor", "B. open a shop", "C. join a local association or club", "D. teach at the school"], a: 2, why: "they had to join a local association, choir, fire brigade or football club。" },
      { type: "sa", q: "What is the 'core insight' of the experiment?", a: "A place does not need to offer a career, only a life — and a reason to stay past the first snow.", why: "末句 the core insight travels well 后的原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Online reviews were meant to democratise judgement; increasingly, they punish difference. A restaurant with a 4.2 rating and an unusual menu will often lose customers to a 4.6-rated place serving the familiar. Economists studying the effect call it the 'superstar squeeze': when everyone can see the same rankings, everyone piles onto the same winners, and small providers learn that the safest strategy is to resemble the top-rated competitor as closely as possible. The result is visible on any delivery app — hundreds of restaurants, one menu. Some platforms now experiment with hiding exact scores or personalising rankings, hoping to restore the diversity that perfect information accidentally destroyed.",
    qs: [
      { type: "tf", q: "Higher-rated restaurants always serve more unusual food.", a: "F", why: "高分店 serving the familiar；逻辑相反。" },
      { type: "tf", q: "The 'superstar squeeze' pushes small providers to imitate top competitors.", a: "T", why: "the safest strategy is to resemble the top-rated competitor。" },
      { type: "mc", q: "Some platforms are now trying to:", opts: ["A. delete all reviews", "B. hide exact scores or personalise rankings", "C. raise restaurant prices", "D. hire more food critics"], a: 1, why: "experiment with hiding exact scores or personalising rankings。" },
      { type: "sa", q: "What does 'hundreds of restaurants, one menu' mean?", a: "Rankings have pushed restaurants to become nearly identical, destroying diversity.", why: "这是对 result 的形象描述：评分压力导致趋同。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The humble houseplant has become an unlikely economic indicator. Sales of indoor plants doubled during the pandemic years, but analysts noticed something stranger: the buyers were not the expected gardening generation. They were renters in their twenties, people with no garden, no certainty of staying, and, often, no plan beyond the next lease. A plant, psychologists suggest, is the cheapest available form of commitment — something alive that is yours, that responds to care, and that fits in a car boot when you move. Garden centres have adapted ruthlessly, marketing 'unkillable' species and selling pots with drainage instructions for beginners. Whether a monstera can substitute for a mortgage is doubtful, but the desire it answers is real enough.",
    qs: [
      { type: "tf", q: "Indoor plant sales doubled during the pandemic.", a: "T", why: "Sales of indoor plants doubled during the pandemic years。" },
      { type: "tf", q: "Most new plant buyers were experienced older gardeners.", a: "F", why: "not the expected gardening generation. They were renters in their twenties。" },
      { type: "mc", q: "According to psychologists, a plant offers young renters:", opts: ["A. a financial investment", "B. the cheapest available form of commitment", "C. a way to meet neighbours", "D. cleaner air"], a: 1, why: "the cheapest available form of commitment。" },
      { type: "sa", q: "How have garden centres adapted to the new buyers?", a: "They market 'unkillable' species and sell pots with drainage instructions for beginners.", why: "Garden centres have adapted 后一句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "In 1900, the average American spent three percent of income on entertainment; today the figure is similar, but the menu is unrecognisable. Economists note that entertainment has undergone a quiet deflation: a streaming subscription costs less in real terms than a single theatre ticket did a century ago. The scarcity has moved elsewhere — from content to attention. When a village had one travelling theatre, the performance was an event; when a phone holds ten thousand, nothing is. This explains a paradox familiar to parents: children with infinite cartoons are bored faster than children with three. Choice researchers call it the 'paradox of plenty', and its lesson extends beyond entertainment — abundance does not remove the need to choose; it makes choosing the hard part.",
    qs: [
      { type: "tf", q: "Americans spend a much larger share of income on entertainment today than in 1900.", a: "F", why: "today the figure is similar。" },
      { type: "tf", q: "Attention has become the scarce resource.", a: "T", why: "The scarcity has moved elsewhere — from content to attention。" },
      { type: "mc", q: "The paradox mentioned is that children with infinite cartoons:", opts: ["A. watch too little", "B. get bored faster", "C. read more books", "D. sleep better"], a: 1, why: "children with infinite cartoons are bored faster than children with three。" },
      { type: "sa", q: "What is the broader lesson of the 'paradox of plenty'?", a: "Abundance does not remove the need to choose; it makes choosing the hard part.", why: "末句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Ships have a speed problem invisible to land dwellers: barnacles, algae and slime. This 'biofouling' adds drag, and drag burns fuel — a badly fouled hull can consume thirty percent more. For a century the answer was poison: paints laced with copper that killed whatever attached. It worked, and it slowly poisoned harbours. The new generation of solutions copies nature instead. One coating mimics shark skin, whose microscopic ridges give larvae nothing flat to grip; another stays slightly slippery, so growth slides off once the ship reaches speed. Early trials report fuel savings near ten percent, and port cities are watching closely. It is a recurring pattern in engineering: the elegant answer was often growing, unnoticed, on the problem itself.",
    qs: [
      { type: "tf", q: "A badly fouled hull can raise fuel consumption by about 30%.", a: "T", why: "a badly fouled hull can consume thirty percent more。" },
      { type: "tf", q: "Copper-based paints had no environmental cost.", a: "F", why: "it slowly poisoned harbours。" },
      { type: "mc", q: "The shark-skin-inspired coating works by:", opts: ["A. poisoning larvae", "B. heating the hull", "C. offering larvae nothing flat to grip", "D. attracting fish"], a: 2, why: "microscopic ridges give larvae nothing flat to grip。" },
      { type: "sa", q: "What 'recurring pattern in engineering' does the author identify?", a: "The elegant answer was often growing, unnoticed, on the problem itself — i.e. nature already models the solution.", why: "末句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "A London hospital experimented with a strange prescription: museum visits. Doctors sent patients with chronic pain and depression to galleries, not as decoration but as treatment, in structured ninety-minute sessions led by educators. The results, published after a two-year trial, showed modest but real improvements in reported wellbeing — smaller than medication, larger than doing nothing. Sceptics point out the obvious confound: perhaps any group outing would do as much, and the art is beside the point. The researchers concede the possibility cheerfully. Their defence is practical: unlike most outings, museums are free, wheelchair-friendly, open in all weather, and stocked with ten thousand conversation starters. Sometimes the content of the medicine matters less than the reliability of the bottle.",
    qs: [
      { type: "tf", q: "The museum visits replaced medication entirely.", a: "NG", why: "原文只说效果小于药物，没说取代药物。" },
      { type: "tf", q: "Improvements were larger than doing nothing.", a: "T", why: "smaller than medication, larger than doing nothing。" },
      { type: "mc", q: "The sceptics' objection is that:", opts: ["A. museums are too expensive", "B. any group outing might work as well", "C. the trial was too long", "D. patients disliked art"], a: 1, why: "perhaps any group outing would do as much。" },
      { type: "sa", q: "List two practical advantages of museums as 'treatment venues'.", a: "They are free, wheelchair-friendly, open in all weather, and full of conversation starters. (任意两点即可)", why: "unlike most outings, museums are free, wheelchair-friendly... 列举处。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Note-taking by hand is slower, messier and, study after study suggests, better. The mechanism is not mystical. Because handwriting cannot keep pace with speech, the note-taker is forced to select, compress and rephrase — and that processing, not the paper, is where learning happens. Laptop users, able to transcribe verbatim, often do exactly that, producing beautiful notes and shallow memory. The finding has an uncomfortable edge for digital enthusiasts: the feature they prize most, speed, is precisely the problem. Some universities have responded by teaching note-making explicitly, treating it as a skill rather than a reflex. The broader lesson applies wherever tools promise frictionlessness: friction is sometimes the function. Resistance, in cognition as in the gym, is what builds the muscle.",
    qs: [
      { type: "tf", q: "Handwriting allows people to record speech word for word.", a: "F", why: "handwriting cannot keep pace with speech。" },
      { type: "tf", q: "Laptop note-takers often end up with shallow memory.", a: "T", why: "producing beautiful notes and shallow memory。" },
      { type: "mc", q: "The real source of learning in note-taking is:", opts: ["A. the quality of the paper", "B. the speed of writing", "C. the selecting and rephrasing the writer must do", "D. reviewing notes at night"], a: 2, why: "that processing, not the paper, is where learning happens。" },
      { type: "sa", q: "What does 'friction is sometimes the function' mean?", a: "The difficulty a tool removes may be exactly the part that produces the benefit, so resistance can be valuable.", why: "结合末句 Resistance ... is what builds the muscle。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Fado, Portugal's mournful song tradition, nearly died of respectability. By the 1960s it had become a museum piece — performed in formal clubs, governed by rules about who could sing and how, beloved by tourists and ignored by the young. Its rescue came from an unlikely direction: amateurs. In Lisbon's old districts, informal taverns kept a parallel fado alive, where anyone could stand up, the rule being only that the room must fall silent. When a new generation of singers emerged from those taverns in the 1990s, they carried the informality with them onto professional stages. The tradition's survival illustrates a cultural paradox: institutions preserve forms, but only use preserves life. A tradition that must be protected from its audience is already half dead.",
    qs: [
      { type: "tf", q: "By the 1960s, fado was popular among young Portuguese.", a: "F", why: "ignored by the young。" },
      { type: "tf", q: "In the taverns, only professional singers were allowed to perform.", a: "F", why: "anyone could stand up。" },
      { type: "mc", q: "The single rule in the informal taverns was that:", opts: ["A. singers had to be amateurs", "B. the room must fall silent", "C. songs had to be old", "D. tourists paid extra"], a: 1, why: "the rule being only that the room must fall silent。" },
      { type: "sa", q: "What 'cultural paradox' does the author draw from fado's survival?", a: "Institutions preserve forms, but only use preserves life — a tradition protected from its audience is already half dead.", why: "末两句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The five-second rule — food dropped on the floor is safe if grabbed quickly — has been tested, and the news is bad for optimists. Bacteria transfer begins on contact; time matters far less than surface and moisture. A wet slice of watermelon picks up contamination almost instantly from tile, while a dry biscuit on carpet may stay relatively clean for a minute. But the deeper finding is about ourselves. Survey data shows people apply the rule selectively: invoked for a favourite biscuit, waived for broccoli. Researchers filed this under 'motivated reasoning' — we do not use beliefs to judge behaviour; we use behaviour to select beliefs. The floor, it turns out, was never the variable. The cookie was.",
    qs: [
      { type: "tf", q: "The longer food stays on the floor, the more bacteria it picks up — this is the main factor.", a: "F", why: "time matters far less than surface and moisture。" },
      { type: "tf", q: "A wet slice of watermelon on tile gets contaminated quickly.", a: "T", why: "picks up contamination almost instantly from tile。" },
      { type: "mc", q: "Survey data showed people use the five-second rule:", opts: ["A. never", "B. consistently for all foods", "C. selectively, depending on how much they want the food", "D. only for vegetables"], a: 2, why: "invoked for a favourite biscuit, waived for broccoli。" },
      { type: "sa", q: "What is 'motivated reasoning' as used here?", a: "We use behaviour to select beliefs rather than using beliefs to judge behaviour.", why: "we do not use beliefs to judge behaviour; we use behaviour to select beliefs。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "In the 1990s, a fast-growing city in Colombia chose not to build more roads. Instead it poured its budget into a bus network with dedicated lanes, cable cars up the hillside slums, and hundreds of kilometres of cycle paths. Critics predicted chaos: taking road space from cars in a city that loved cars seemed like civic suicide. Two decades later, commute times for the poorest fifth of residents — the people least likely to own a car — fell by more than half, and the cycle paths carry more daily trips than many highways. Urbanists cite the case to make a point that still surprises: a city does not exist to move vehicles but to move people, and those are different problems with different solutions. The traffic jam, they argue, is a design choice, not a law of nature.",
    qs: [
      { type: "tf", q: "The city responded to growth by building more roads.", a: "F", why: "chose not to build more roads。" },
      { type: "tf", q: "Commute times fell most for wealthy car owners.", a: "F", why: "for the poorest fifth of residents ... fell by more than half。" },
      { type: "mc", q: "Critics originally thought the plan would:", opts: ["A. cost too little", "B. end in chaos", "C. help only tourists", "D. reduce bus use"], a: 1, why: "Critics predicted chaos。" },
      { type: "sa", q: "What distinction do urbanists draw from this case?", a: "A city exists to move people, not vehicles — different problems with different solutions; traffic jams are a design choice, not a law of nature.", why: "末两句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The apology is a technology, and Japan may have perfected it. Companies there employ 'apology specialists', train staff in the calibrated bow — fifteen degrees for inconvenience, forty-five for serious fault — and sometimes apologise before blame is even established. Western observers often misread this as weakness or evasion. Anthropologists read it differently: the apology is not primarily an admission of guilt but a repair of the relationship, separating 'we damaged you' from 'we are damaged people'. Interestingly, research in both cultures finds that early, unqualified apologies reduce lawsuits and repeat offences alike — the sued doctor is rarely the incompetent one, but often the one who never said sorry. The cheapest sentence in any language may also be the most undervalued.",
    qs: [
      { type: "tf", q: "In Japan, a forty-five-degree bow signals slight inconvenience.", a: "F", why: "fifteen degrees for inconvenience, forty-five for serious fault；角度张冠李戴。" },
      { type: "tf", q: "Anthropologists see the Japanese apology mainly as an admission of guilt.", a: "F", why: "not primarily an admission of guilt but a repair of the relationship。" },
      { type: "mc", q: "According to the research, doctors who get sued are often:", opts: ["A. the most incompetent", "B. those who never apologised", "C. the youngest", "D. foreign-trained"], a: 1, why: "often the one who never said sorry。" },
      { type: "sa", q: "What two things does the apology separate, according to anthropologists?", a: "'We damaged you' from 'we are damaged people' — the act from the identity.", why: "separating 'we damaged you' from 'we are damaged people'。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Astronauts returning from orbit report a strange, reliable grief: they miss the view, but what they describe missing most is the smell of Earth. Space has no smell, they explain, or rather it has one — hot metal, fried steak, the inside of a vacuum cleaner — and it is the smell of nothing growing. The observation has practical weight. Designers of long missions to Mars now treat sensory variety as cargo: fresh herbs in hydroponic racks, varied lighting temperatures, textures on walls. Psychologists point out that explorers have always known this intuitively; polar expeditions carried greenhouses long before the science justified them. The lesson scales down to any designed environment, from offices to hospitals: humans are not machines that need fuel. We are ecosystems that need weather.",
    qs: [
      { type: "tf", q: "Astronauts say space has no smell at all.", a: "F", why: "Space has no smell, they explain, or rather it has one —— 有味道，是金属味。" },
      { type: "tf", q: "Polar expeditions carried greenhouses before science supported the practice.", a: "T", why: "long before the science justified them。" },
      { type: "mc", q: "Mars mission designers now treat sensory variety as:", opts: ["A. a luxury to cut first", "B. cargo — something essential to pack", "C. a medical experiment", "D. irrelevant"], a: 1, why: "treat sensory variety as cargo。" },
      { type: "sa", q: "What does 'we are ecosystems that need weather' mean?", a: "Humans need sensory variety and change — smells, light, texture — not just fuel-like basics.", why: "对末句的转述：人需要多样的感官环境。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The world's quietest room, an anechoic chamber in Minnesota, absorbs 99.99 percent of sound. Visitors are invited to sit inside, and few last an hour. With no echo, the brain loses its acoustic map of space; people report hearing their own heartbeat, their lungs, the scrape of their joints. Some find it peaceful; many find it unbearable, and disorientation sets in within minutes. Engineers use the chamber to test product noise, but psychologists have adopted it for a different lesson: the human mind did not evolve for silence. It evolved for signal — wind in grass, footsteps, water. Total silence is not the absence of stress but a strange kind of noise, the sound of a brain searching for input and finding only itself.",
    qs: [
      { type: "tf", q: "Most visitors enjoy staying in the chamber for several hours.", a: "F", why: "few last an hour。" },
      { type: "tf", q: "The chamber absorbs nearly all sound.", a: "T", why: "absorbs 99.99 percent of sound。" },
      { type: "mc", q: "Inside the chamber, people begin to hear:", opts: ["A. music", "B. other visitors whispering", "C. their own heartbeat and joints", "D. traffic outside"], a: 2, why: "hearing their own heartbeat, their lungs, the scrape of their joints。" },
      { type: "sa", q: "What lesson do psychologists draw from the chamber?", a: "The human mind evolved for signal, not silence — total silence acts like a strange noise because the brain keeps searching for input.", why: "末三句综合。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Reusable bags were the environmental movement's easiest win, until someone counted properly. A Danish government study calculated that a cotton tote must be used thousands of times before its climate impact beats a single-use plastic bag, because cotton growing is water- and land-hungry. The finding was gleefully circulated by plastic defenders and quietly misunderstood by everyone else. The study measured climate, not ocean litter — and plastic's true cost is what it does after disposal, not before. The real lesson is about single metrics. Any object looks virtuous or wicked depending on which ledger you open. Environmentalists now urge a simpler rule, less exciting than any tote: the greenest bag is whichever one you already own, used until it falls apart.",
    qs: [
      { type: "tf", q: "Cotton totes beat plastic bags on climate impact after just a few uses.", a: "F", why: "must be used thousands of times before its climate impact beats a single-use plastic bag。" },
      { type: "tf", q: "The Danish study measured plastic's effect on oceans.", a: "F", why: "The study measured climate, not ocean litter。" },
      { type: "mc", q: "According to the passage, plastic's true cost lies in:", opts: ["A. production", "B. what happens after disposal", "C. transport", "D. advertising"], a: 1, why: "plastic's true cost is what it does after disposal, not before。" },
      { type: "sa", q: "What is the 'simpler rule' environmentalists now urge?", a: "The greenest bag is whichever one you already own, used until it falls apart.", why: "末句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "When a language dies, the obituaries usually mourn its poetry. Linguists mourn something else: its filing system. Every language encodes a unique theory of what matters — which directions, which relationships, which categories deserve their own words. An Australian aboriginal language with no word for 'left' or 'right' forces its speakers to track compass directions constantly, and they do, effortlessly, developing spatial abilities that baffle visiting researchers. A Matses speaker in the Amazon must mark, grammatically, how they know each fact — seen, inferred, or reported. When such languages vanish, we do not lose synonyms; we lose tested solutions to the problem of being human. The last speaker takes with them not a dictionary but an instrument panel, built over ten thousand years of paying attention.",
    qs: [
      { type: "tf", q: "The Australian language described has words for 'left' and 'right'.", a: "F", why: "with no word for 'left' or 'right'。" },
      { type: "tf", q: "Matses grammar requires marking the source of knowledge.", a: "T", why: "must mark, grammatically, how they know each fact。" },
      { type: "mc", q: "According to the author, what is lost when a language dies?", opts: ["A. only poetry", "B. synonyms", "C. tested solutions to the problem of being human", "D. tourist income"], a: 2, why: "we do not lose synonyms; we lose tested solutions to the problem of being human。" },
      { type: "sa", q: "What does the 'instrument panel' metaphor mean?", a: "A language embodies tools for paying attention, built up over millennia, not just a list of words.", why: "末句 not a dictionary but an instrument panel ... of paying attention。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "A famous study tracked children who were offered one marshmallow now or two if they could wait fifteen minutes. Decades of retellings turned it into a parable of willpower: patient children went on to higher grades, better jobs, steadier lives. Then researchers redid the experiment with a crucial control — family background — and most of the magic vanished. Children from unstable homes had good reason to grab the marshmallow: in their experience, promised second marshmallows did not always arrive. The revised lesson is less flattering to the patient and more useful to everyone else. What looked like character was partly calculation, a rational reading of whether the world keeps its promises. Before teaching children to wait, the researchers concluded, it is worth asking whether waiting, in their world, has ever worked.",
    qs: [
      { type: "tf", q: "The original retellings credited willpower for later success.", a: "T", why: "turned it into a parable of willpower。" },
      { type: "tf", q: "Controlling for family background strengthened the original conclusion.", a: "F", why: "most of the magic vanished。" },
      { type: "mc", q: "Children from unstable homes grabbed the marshmallow because:", opts: ["A. they lacked self-control", "B. experience taught them promises might not be kept", "C. they disliked marshmallows", "D. they were older"], a: 1, why: "in their experience, promised second marshmallows did not always arrive。" },
      { type: "sa", q: "What is the researchers' revised conclusion?", a: "What looked like character was partly a rational calculation about whether the world keeps its promises; check whether waiting has ever worked in a child's world before teaching it.", why: "倒数第二句 + 末句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The city of Paris maintains a second city beneath it: two hundred kilometres of tunnels, quarried for the limestone that built the monuments above. Officially, the tunnels are closed. Unofficially, they host cinema clubs, dinner parties and a secret bar, maintained by 'cataphiles' who enter through manholes with candles and rope. The police have a dedicated squad; the cataphiles have a dedicated repair crew, which once restored a crumbling crypt unnoticed and left a note. The authorities' tolerance is strategic — the explorers serve as free inspectors, reporting cracks and floods before the engineers find them. It is an odd urban contract: rule-breakers tolerated because they are, on balance, useful. Every city, one urbanist observed, runs on the gap between its map and its territory.",
    qs: [
      { type: "tf", q: "The tunnels under Paris were dug to hold the metro.", a: "F", why: "quarried for the limestone —— 采石场，不是地铁。" },
      { type: "tf", q: "Cataphiles once secretly repaired a crypt.", a: "T", why: "restored a crumbling crypt unnoticed and left a note。" },
      { type: "mc", q: "Why do the authorities tolerate the explorers?", opts: ["A. They pay entrance fees", "B. They are too many to arrest", "C. They act as free inspectors, reporting damage early", "D. They vote for the mayor"], a: 2, why: "the explorers serve as free inspectors。" },
      { type: "sa", q: "What does 'the gap between its map and its territory' mean?", a: "The difference between how a city is officially organised and how it actually works in practice.", why: "对末句的转述：官方规则与现实运作之间的缝隙。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Job interviews are theatre, and everyone knows their lines. The candidate claims to love challenges; the interviewer claims the company is a family. Organisational psychologists have long known that unstructured interviews predict job performance barely better than a coin toss, yet they persist because they feel informative. The fix exists and is unglamorous: structured interviews, where every candidate faces the same questions scored against the same rubric, roughly double the predictive power. Resistance to them is revealing. Managers trust their gut because the gut gives instant, confident answers, while rubrics give slow, defensible ones. The deeper problem, one researcher noted, is that interviews are not really selection tools. They are rituals of belonging, and rituals do not need to work to survive.",
    qs: [
      { type: "tf", q: "Unstructured interviews predict performance much better than chance.", a: "F", why: "predict job performance barely better than a coin toss。" },
      { type: "tf", q: "Structured interviews use different questions for each candidate.", a: "F", why: "every candidate faces the same questions。" },
      { type: "mc", q: "Why do managers resist structured interviews?", opts: ["A. They are illegal", "B. They take too long to design", "C. Gut instinct feels faster and more confident", "D. Candidates dislike them"], a: 2, why: "the gut gives instant, confident answers, while rubrics give slow, defensible ones。" },
      { type: "sa", q: "What is the researcher's 'deeper problem' claim?", a: "Interviews are rituals of belonging rather than real selection tools — and rituals survive even if they don't work.", why: "末两句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "In 2019, a Swiss town installed a vending machine that sells neither drinks nor snacks but cheese. It dispenses local raclette around the clock, restocked by the dairy farmers themselves. Locals were amused; then sales data arrived, showing steady purchases at two in the morning, mostly by night-shift workers for whom shops never open. The machine is now studied in business schools, less for the cheese than for the principle: rural services fail not from lack of demand but from mismatched hours. Villages that cannot support a shop may still support a shop's inventory, if no one has to be paid to stand behind the counter. The lesson generalises awkwardly far — banking, libraries, even healthcare — anywhere the cost of being open exceeds the cost of being stocked.",
    qs: [
      { type: "tf", q: "The vending machine was installed to amuse locals.", a: "F", why: "Locals were amused 是反应，不是安装目的。" },
      { type: "tf", q: "Night-shift workers became major customers.", a: "T", why: "mostly by night-shift workers。" },
      { type: "mc", q: "According to the passage, rural services fail mainly because of:", opts: ["A. poor quality", "B. mismatched hours, not lack of demand", "C. high rent", "D. online competition"], a: 1, why: "fail not from lack of demand but from mismatched hours。" },
      { type: "sa", q: "What general principle does the cheese machine illustrate?", a: "Where the cost of being open exceeds the cost of being stocked, a staffed shop can be replaced by an unstaffed one.", why: "末句 anywhere the cost of being open exceeds the cost of being stocked。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The placebo effect has an embarrassing sibling: the nocebo effect, where harmless treatment causes real harm because the patient expects harm. In drug trials, patients given sugar pills report the side effects listed on the warning sheet — headache, nausea, fatigue — at rates researchers call 'the price of information'. Tell someone a procedure will hurt, and measured pain rises; tell them it will not, and it falls. The findings sit uncomfortably with informed consent, which legally requires listing every possible harm. Some hospitals now experiment with 'contextualised consent', naming common side effects but framing them against base rates. Critics worry this drifts toward paternalism; defenders reply that pure information was never neutral. Every warning is also a prediction, and predictions about the body have a way of coming true.",
    qs: [
      { type: "tf", q: "The nocebo effect involves harmful drugs.", a: "F", why: "harmless treatment causes real harm —— 治疗本身无害。" },
      { type: "tf", q: "Patients on sugar pills reported side effects from the warning sheet.", a: "T", why: "patients given sugar pills report the side effects listed on the warning sheet。" },
      { type: "mc", q: "'Contextualised consent' means:", opts: ["A. hiding all side effects", "B. naming common side effects against base rates", "C. longer consent forms", "D. paying patients more"], a: 1, why: "naming common side effects but framing them against base rates。" },
      { type: "sa", q: "Why is pure information 'never neutral', according to defenders?", a: "Because every warning is also a prediction, and predictions about the body tend to come true.", why: "末句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The shopping mall, declared dead a decade ago, is quietly reincarnating — as its opposite. Across America, failed malls are being converted into distribution centres, the very warehouses that killed them. The fit is eerie: vast floor space, truck access, highway junctions, and parking lots that become trailer yards. Urbanists find the symbolism irresistible — the cathedral of consumption becoming the engine room of delivery. But the conversion has a quieter significance. Malls were among the last places where strangers of different incomes shared indoor space without paying; warehouses admit no public at all. The logistics boom is efficient, climate-controlled and sealed. Something is gained with every next-day parcel, and something — unmeasured, unmonetised, easy to dismiss until it is gone — is lost with every food court.",
    qs: [
      { type: "tf", q: "Dead malls are being turned into distribution centres.", a: "T", why: "failed malls are being converted into distribution centres。" },
      { type: "tf", q: "Warehouses offer the same public access malls once did.", a: "F", why: "warehouses admit no public at all。" },
      { type: "mc", q: "What made malls uniquely valuable as social spaces?", opts: ["A. Cheap food", "B. Strangers of different incomes shared space without paying", "C. Long opening hours", "D. Free parking"], a: 1, why: "where strangers of different incomes shared indoor space without paying。" },
      { type: "sa", q: "What is the 'something lost' the author refers to?", a: "The unmeasured, unmonetised public mixing space that malls provided.", why: "末句 something — unmeasured, unmonetised ... is lost。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "A chess grandmaster and a club player look at the same board for five seconds. Asked to reproduce it, the grandmaster succeeds easily — unless the pieces were placed randomly, in which case the advantage vanishes. This classic experiment founded 'chunk' theory: expertise is not a better memory but a better filing system, ten thousand stored patterns that turn twenty pieces into five familiar clusters. The finding explains why experts can be oddly helpless outside their domain; the grandmaster's filing system is empty for bridge or business. It also carries advice for learners that is less romantic than talent and more encouraging: skill is largely inventory. The expert simply owns more chunks, and chunks, unlike talent, can be stocked one at a time by anyone stubborn enough to keep shelving.",
    qs: [
      { type: "tf", q: "Grandmasters remember random piece placements better than club players.", a: "F", why: "unless the pieces were placed randomly, in which case the advantage vanishes。" },
      { type: "tf", q: "Experts' advantages transfer easily to other domains.", a: "F", why: "experts can be oddly helpless outside their domain。" },
      { type: "mc", q: "'Chunk' theory says expertise is mainly:", opts: ["A. faster eyes", "B. a better filing system of stored patterns", "C. natural talent", "D. younger age"], a: 1, why: "expertise is not a better memory but a better filing system。" },
      { type: "sa", q: "What encouraging advice does the author draw for learners?", a: "Skill is largely inventory — chunks can be stocked one at a time by anyone stubborn enough.", why: "skill is largely inventory ... chunks ... can be stocked one at a time。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Singapore's public housing is famous for one quiet rule: every block must mirror the ethnic mix of the nation. No building may be all of anything. Critics call it social engineering, and it is — deliberately. The policy was born from race riots in the 1960s, on the theory that segregation is not neutral but a seed, growing distrust in the dark between communities. Fifty years on, surveys show Singaporeans report more cross-ethnic friendships than neighbours in comparable cities, though grumbling about the rules persists whenever a flat cannot be sold to the highest bidder. The policy's defenders make a subtler claim than harmony: not that people who live together love each other, but that they can no longer imagine each other as a rumour.",
    qs: [
      { type: "tf", q: "Singapore's housing rule requires each block to reflect the national ethnic mix.", a: "T", why: "every block must mirror the ethnic mix of the nation。" },
      { type: "tf", q: "The policy was introduced to raise property prices.", a: "F", why: "born from race riots in the 1960s —— 起因是种族骚乱。" },
      { type: "mc", q: "Surveys after fifty years show:", opts: ["A. no change", "B. more cross-ethnic friendships than in comparable cities", "C. fewer friendships overall", "D. rising segregation"], a: 1, why: "more cross-ethnic friendships than neighbours in comparable cities。" },
      { type: "sa", q: "What is the defenders' subtler claim?", a: "Not that neighbours come to love each other, but that they can no longer imagine each other as a rumour.", why: "末句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The dictionary is the only book that is never finished. Lexicographers describe their work as fishing with a net full of holes: by the time a word is caught, defined and printed, the language has swum on. 'Selfie' took barely a decade from first sighting to dictionary entry; 'ghost' as a verb meaning to vanish from someone's messages took less. Purists lament that dictionaries have become too permissive, recording errors as usage. Lexicographers answer that they were never referees, only field biologists — the dictionary does not legislate the jungle, it maps it. The comforting corollary is that language cannot be ruined, only changed; every generation's slang that 'destroys English' becomes, with embarrassing reliability, the next century's standard speech.",
    qs: [
      { type: "tf", q: "A dictionary is eventually completed.", a: "F", why: "the only book that is never finished。" },
      { type: "tf", q: "'Selfie' entered dictionaries faster than 'ghost' as a verb.", a: "F", why: "'ghost' ... took less（时间更短）。" },
      { type: "mc", q: "Lexicographers compare themselves to:", opts: ["A. referees", "B. lawmakers", "C. field biologists", "D. fishermen with perfect nets"], a: 2, why: "never referees, only field biologists；net full of holes 说明网并不好，D 错。" },
      { type: "sa", q: "What is the 'comforting corollary'?", a: "Language cannot be ruined, only changed — each generation's slang tends to become the next century's standard speech.", why: "末句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "An office in Amsterdam removed every bin from every desk, leaving one central sorting station per floor. Complaints were immediate and predictable; then something unplanned happened. Employees began meeting at the sorting station the way they once met at the water cooler, and waste sorting accuracy rose to ninety percent — not because people cared more, but because throwing something away had become visible, a small public act performed in front of colleagues. The designers cite this as 'productive friction': the obstacle was the mechanism. The lesson has spread to other behaviour problems: stairs placed before lifts, printers that default to double-sided, cafeterias that put salads at eye level. Convenience, it turns out, is a superb teacher of bad habits, and mild inconvenience is the cheapest supervisor ever hired.",
    qs: [
      { type: "tf", q: "Sorting accuracy improved because employees became more environmentally conscious.", a: "F", why: "not because people cared more, but because ... visible。" },
      { type: "tf", q: "The sorting station replaced the water cooler as a social spot.", a: "T", why: "began meeting at the sorting station the way they once met at the water cooler。" },
      { type: "mc", q: "'Productive friction' refers to:", opts: ["A. office arguments", "B. obstacles deliberately used to change behaviour", "C. faster printers", "D. more bins"], a: 1, why: "the obstacle was the mechanism。" },
      { type: "sa", q: "Give one other example of the same principle from the text.", a: "Stairs placed before lifts / printers defaulting to double-sided / salads at eye level.（任一即可）", why: "原文列举的三例。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Tourists visiting the same Venetian square generate the same photograph, and researchers can now prove it. By analysing millions of uploaded images, computer scientists showed that tourist photos cluster tightly around a handful of 'canonical viewpoints' — the angles made famous by earlier photographs. The camera, marketed as a tool for seeing freshly, functions in practice as a tool for confirming what has already been seen. There is a feedback loop: platforms surface popular angles, visitors reproduce them, and the reproductions become the next generation's targets. Some destinations now design against the loop, hiding their famous views behind framing walks that force new approaches. Whether tourists comply is doubtful. The souvenir, after all, was never really the view. It was the proof of having stood where the view was known to be.",
    qs: [
      { type: "tf", q: "Tourist photos cluster around a few famous angles.", a: "T", why: "cluster tightly around a handful of 'canonical viewpoints'。" },
      { type: "tf", q: "Platforms reduce repetition by hiding popular photos.", a: "F", why: "platforms surface popular angles —— 平台在放大重复，不是减少。" },
      { type: "mc", q: "Some destinations fight the loop by:", opts: ["A. banning cameras", "B. designing framing walks that force new approaches", "C. closing the squares", "D. charging for photos"], a: 1, why: "hiding their famous views behind framing walks。" },
      { type: "sa", q: "According to the author, what is the souvenir really?", a: "Proof of having stood where the view was known to be, not the view itself.", why: "末句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The North Atlantic right whale is being saved, in part, by accountants. Ship strikes kill more right whales than any other human cause, and the obvious fix — slow the ships — was fought for years as economically ruinous. Then economists priced the trade-off precisely: a modest speed reduction in migration season cost the average shipment about four hours and a few hundred dollars, while the whale's death cost, in regulatory penalties, rerouting and litigation, ran into millions. Framed as a bill rather than a plea, the policy passed. Conservationists draw a lesson they find both useful and faintly depressing: moral arguments moved nothing for a decade; arithmetic moved regulators in a season. The whale survives not because it was loved more, but because it was finally costed correctly.",
    qs: [
      { type: "tf", q: "Ship strikes are the leading human cause of right whale deaths.", a: "T", why: "Ship strikes kill more right whales than any other human cause。" },
      { type: "tf", q: "Slowing ships was economically ruinous, as opponents claimed.", a: "F", why: "a modest speed reduction ... cost the average shipment about four hours and a few hundred dollars。" },
      { type: "mc", q: "The policy passed when it was framed as:", opts: ["A. a moral plea", "B. a bill — a financial calculation", "C. a tourist attraction", "D. an international treaty"], a: 1, why: "Framed as a bill rather than a plea, the policy passed。" },
      { type: "sa", q: "What 'faintly depressing' lesson do conservationists draw?", a: "Moral arguments moved nothing for a decade; arithmetic moved regulators in a season — the whale was saved by correct costing, not by love.", why: "倒数第二句和末句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Prisons in Norway look uncomfortably like hotels, and that is the point. Cells have televisions and kettles; guards eat with inmates; the maximum sentence is twenty-one years, no matter the crime. Visiting journalists write the same astonished story, and recidivism statistics write the punchline: Norway's reoffending rate is among the world's lowest, roughly a third of America's. The logic is deliberately anti-intuitive. A prisoner, the system argues, leaves prison eventually — nearly all of them do — and society's real choice is not between comfort and punishment but between what kind of neighbour returns. Critics answer that low reoffending reflects Norway's wealth, not its prisons, and the honest verdict is that both matter. What is harder to dispute is the design principle: a system built for revenge produces people built for nothing else.",
    qs: [
      { type: "tf", q: "Norway's maximum prison sentence is life.", a: "F", why: "the maximum sentence is twenty-one years。" },
      { type: "tf", q: "Norway's reoffending rate is about one third of America's.", a: "T", why: "roughly a third of America's。" },
      { type: "mc", q: "Critics attribute Norway's low reoffending mainly to:", opts: ["A. strict guards", "B. the country's wealth", "C. short sentences", "D. religion"], a: 1, why: "low reoffending reflects Norway's wealth, not its prisons。" },
      { type: "sa", q: "What is the system's core argument about prisoners?", a: "Nearly all prisoners leave eventually, so the real choice is what kind of neighbour returns — not comfort versus punishment.", why: "A prisoner ... leaves prison eventually ... society's real choice is ... what kind of neighbour returns。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "An Irish town of three thousand people produces more published poets per capita than Dublin, and nobody is entirely sure why. Theories pile up: the annual festival, the bookshop that stocks local work first, the pub where the back room has hosted a reading every Thursday since 1974. Economists would call it an 'agglomeration effect', the same force that clusters tech firms in one valley — but the locals offer a simpler account. Poetry there is not a career but a habit, as unremarkable as darts. A farmer reads after the veterinarian; applause is polite, brief, and the same for everyone. Literary scholars note that great traditions rarely begin with great poets; they begin with rooms where mediocre poems are tolerated kindly until, one Thursday, a good one walks in.",
    qs: [
      { type: "tf", q: "The town produces more poets per capita than Dublin.", a: "T", why: "produces more published poets per capita than Dublin。" },
      { type: "tf", q: "The Thursday reading began in 1984.", a: "F", why: "every Thursday since 1974；年份偷换。" },
      { type: "mc", q: "The locals' own explanation is that poetry in the town is:", opts: ["A. a well-paid career", "B. a habit, as unremarkable as darts", "C. a tourist product", "D. a school subject"], a: 1, why: "Poetry there is not a career but a habit。" },
      { type: "sa", q: "According to literary scholars, how do great traditions begin?", a: "With rooms where mediocre poems are tolerated kindly, until a good one walks in — not with great poets.", why: "末句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The map app has made a curious trade on our behalf: certainty for competence. Drivers who navigate by turn-by-turn instructions arrive reliably and learn nothing; studies show they cannot sketch the route afterwards, misjudge distances, and struggle when the signal drops. The hippocampus, the brain's mapmaker, grows measurably in London taxi drivers who memorise the city's twenty-five thousand streets — and, other studies suggest, idles in habitual GPS users. None of this makes the technology evil; it makes it a wheelchair for a muscle that weakens exactly as much as it rests. Navigation researchers now propose 'fading' interfaces that give directions only when you err. Whether anyone wants them is unclear. The market prefers the wheelchairs, and muscles, being silent, rarely get a vote.",
    qs: [
      { type: "tf", q: "Turn-by-turn users can usually sketch their route afterwards.", a: "F", why: "they cannot sketch the route afterwards。" },
      { type: "tf", q: "London taxi drivers show growth in the hippocampus.", a: "T", why: "grows measurably in London taxi drivers。" },
      { type: "mc", q: "The author compares GPS to:", opts: ["A. a teacher", "B. a wheelchair for a muscle", "C. a map", "D. a compass"], a: 1, why: "a wheelchair for a muscle that weakens exactly as much as it rests。" },
      { type: "sa", q: "What are 'fading' interfaces?", a: "Navigation systems that give directions only when you make an error, keeping your own mapmaking active.", why: "interfaces that give directions only when you err。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "A century ago, the department store invented the free sample, and with it a discovery about human nature that supermarkets still exploit: obligation is sticky. The shopper who accepts a cube of cheese feels, obscurely, in debt; purchases rise measurably even when the sample is disliked. Psychologists call it reciprocity, the oldest glue of social life, and note its ruthless efficiency — the gift need not be wanted, only received. Charities learnt this long ago, which is why their envelopes arrive containing pens and address labels you never ordered. The defence, researchers suggest, is not refusing gifts, which social life makes impossible, but noticing the transaction. The moment the free cheese is recognised as a hook, the debt dissolves. Obligation survives only in the dark; seen clearly, it is just cheddar.",
    qs: [
      { type: "tf", q: "Samples increase purchases even when shoppers dislike the product.", a: "T", why: "purchases rise measurably even when the sample is disliked。" },
      { type: "tf", q: "Reciprocity requires the gift to be wanted.", a: "F", why: "the gift need not be wanted, only received。" },
      { type: "mc", q: "Charities include pens and address labels in their envelopes because:", opts: ["A. donors request them", "B. small unsolicited gifts create obligation", "C. they are cheap to print", "D. regulations require it"], a: 1, why: "Charities learnt this long ago —— 利用 reciprocity。" },
      { type: "sa", q: "What defence do researchers suggest against reciprocity pressure?", a: "Noticing the transaction — recognising the free gift as a hook dissolves the feeling of debt.", why: "the moment the free cheese is recognised as a hook, the debt dissolves。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The word 'deadline' was once literal. In the American Civil War, it named a line around a military prison camp: cross it, and guards shot without warning. Journalists adopted the word for their own purposes, and somewhere between the printing press and the newsroom it lost its bullets. Linguists use it as a favourite example of 'semantic bleaching' — the process by which a word keeps its force but sheds its content. 'Awesome' once described mountains and gods; now it describes parking spaces. The process is usually mourned as decay, but it has a defence: bleaching is the tax language pays for being used. A word powerful enough to matter is a word people will reach for at smaller occasions, and every reach thins it slightly. Meaning, like money, inflates with circulation.",
    qs: [
      { type: "tf", q: "In the Civil War, crossing the deadline meant arrest.", a: "F", why: "guards shot without warning —— 是被射杀，不是逮捕。" },
      { type: "tf", q: "'Awesome' has undergone semantic bleaching.", a: "T", why: "原文以 awesome 为例说明词义漂白。" },
      { type: "mc", q: "The author's defence of bleaching is that:", opts: ["A. it makes language more precise", "B. it is the price words pay for being used widely", "C. it only affects slang", "D. it can be reversed"], a: 1, why: "bleaching is the tax language pays for being used。" },
      { type: "sa", q: "What does the money metaphor at the end mean?", a: "Meaning inflates with circulation — the more a word is used, the thinner its meaning becomes.", why: "末句 Meaning, like money, inflates with circulation。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Finland's libraries are being reborn as something stranger: workshops. The flagship Helsinki library devotes an entire floor to sewing machines, 3D printers, recording studios and a commercial kitchen, all free. Book loans, meanwhile, occupy one floor of three. The philosophy is blunt: information is no longer scarce, but tools, space and quiet are. A library that lends knowledge can as logically lend a drill as a novel. Critics worry the mission is dissolving into a general-purpose community centre; librarians reply that the mission was never books — books were the technology of the moment, as scrolls were before them. The deeper function, they argue, is older and sturdier: a place where the city's resources are shared equally by people who could never afford to own them alone.",
    qs: [
      { type: "tf", q: "Books occupy most of the Helsinki library's space.", a: "F", why: "Book loans ... occupy one floor of three。" },
      { type: "tf", q: "Use of the sewing machines and studios is free.", a: "T", why: "all free。" },
      { type: "mc", q: "According to the librarians, the library's true mission is:", opts: ["A. preserving books", "B. lending drills", "C. sharing the city's resources equally", "D. recording music"], a: 2, why: "a place where the city's resources are shared equally。" },
      { type: "sa", q: "What is now scarce, according to the library's philosophy?", a: "Tools, space and quiet — not information.", why: "information is no longer scarce, but tools, space and quiet are。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "In 1972, a plane crashed in the Andes, and the survivors' story is usually told as one of endurance. Less told is the story of the decision. Facing starvation, the group argued for days before eating the dead. The argument was not squeamishness alone; it was a negotiation about what kind of people they would be when rescued. Sociologists later studied the tapes of their debates and found something rare: a moral system being invented in real time, with rules, exemptions and rituals — the bodies of friends treated differently from strangers', promises extracted from the dying. The lesson extends past the mountains. Ethics, it suggests, is not a library of answers but a muscle built by arguing about hard cases, and it atrophies in any society where the hard cases are decided elsewhere.",
    qs: [
      { type: "tf", q: "The survivors decided immediately to eat the dead.", a: "F", why: "the group argued for days before eating the dead。" },
      { type: "tf", q: "Friends' and strangers' bodies were treated identically.", a: "F", why: "the bodies of friends treated differently from strangers'。" },
      { type: "mc", q: "Sociologists found in the debates:", opts: ["A. chaos", "B. a moral system being invented in real time", "C. religious rules copied from home", "D. nothing of interest"], a: 1, why: "a moral system being invented in real time。" },
      { type: "sa", q: "What is the author's general claim about ethics?", a: "Ethics is a muscle built by arguing about hard cases, and it weakens when hard cases are decided elsewhere.", why: "末句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Every Roman recipe for a banquet begins, in effect, with an apology: the ingredients are not available. The Roman empire ran on flavours its successors cannot taste — silphium, a plant so valued it was harvested to extinction; garum, a fermented fish sauce shipped in stamped amphorae like wine. Historians of food point out that extinction of taste is the quietest kind. When a building falls, stones remain; when a cuisine dies, nothing does, because cuisine lives in bodies, soils and supply chains. Modern revival attempts — historians frying reconstructed garum from anchovies — are games of educated guessing. The humbling lesson applies broadly: not everything worth keeping can be kept by wanting to. Some heritage survives only as a recipe nobody can cook.",
    qs: [
      { type: "tf", q: "Silphium still grows wild in North Africa.", a: "F", why: "harvested to extinction。" },
      { type: "tf", q: "Garum was transported in amphorae like wine.", a: "T", why: "shipped in stamped amphorae like wine。" },
      { type: "mc", q: "Why is the extinction of taste 'the quietest kind'?", opts: ["A. Nobody liked the flavours", "B. Unlike buildings, cuisine leaves nothing physical when it dies", "C. Recipes were banned", "D. It happened quickly"], a: 1, why: "When a building falls, stones remain; when a cuisine dies, nothing does。" },
      { type: "sa", q: "What is the 'humbling lesson' the author draws?", a: "Not everything worth keeping can be kept by wanting to; some heritage survives only as an uncookable recipe.", why: "末两句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "A regional airline once calculated that its pilots' greatest safety risk was not storms or engines but boredom. On automated flights, the human watches screens for hours, needed only in the seconds when the machine confesses defeat. Psychologists call this the 'irony of automation': the better the machine, the worse the human's retained skill, and the more that skill is suddenly demanded. The industry's answer is counterintuitive — scheduled manual flying, hand-flown approaches on calm days, practised emergencies nobody expects. It is an admission that skill is perishable and simulation is rent paid on readiness. The principle generalises uncomfortably. Every convenience that thinks for us — spellcheck, navigation, search — is a small loan against a capability, and the repayment schedule is never announced.",
    qs: [
      { type: "tf", q: "Storms were judged the pilots' greatest safety risk.", a: "F", why: "not storms or engines but boredom。" },
      { type: "tf", q: "The 'irony of automation' is that automation improves human skill.", a: "F", why: "the better the machine, the worse the human's retained skill。" },
      { type: "mc", q: "Airlines respond by:", opts: ["A. removing autopilots", "B. scheduling manual flying on calm days", "C. hiring more pilots", "D. shortening flights"], a: 1, why: "scheduled manual flying, hand-flown approaches on calm days。" },
      { type: "sa", q: "What does the author mean by conveniences being 'a small loan against a capability'?", a: "Each tool that thinks for us borrows against a skill that weakens without practice, and the cost comes due later, unannounced.", why: "末句的转述。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The open-plan office was invented in the 1950s by a German consultancy that called it 'office landscape' and imagined it as liberation — walls down, ideas flowing, hierarchy dissolved. The inventor's own firm abandoned it within a decade, but the idea had escaped, carried worldwide by a different motive: it was cheap. Studies now stack up uniformly against it: face-to-face interaction in open offices actually drops, replaced by headphones and messaging; sick days rise; the most-sued phrase in office acoustics is 'I can hear every word'. The paradox has a name among designers: proximity without connection. Packing people together maximises visibility, not communication, and humans defend their attention with whatever walls remain — behavioural ones, mostly, which are heavier to carry than plaster.",
    qs: [
      { type: "tf", q: "The inventor's own firm kept the open plan permanently.", a: "F", why: "abandoned it within a decade。" },
      { type: "tf", q: "Face-to-face interaction increases in open offices.", a: "F", why: "actually drops。" },
      { type: "mc", q: "The open plan spread worldwide mainly because it was:", opts: ["A. popular with staff", "B. cheap", "C. required by law", "D. healthier"], a: 1, why: "carried worldwide by a different motive: it was cheap。" },
      { type: "sa", q: "What is 'proximity without connection'?", a: "Packing people together maximises visibility, not communication, so people build behavioural walls like headphones instead.", why: "末两句的转述。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "A Sardinian village holds the record for concentration of centenarians, and scientists have spent decades hunting the ingredient — the diet, the wine, the genes. The most consistent finding embarrasses the food industry more than it flatters it: the elders' advantage correlates most strongly with geography of a social kind. The village is steep; everyone walks. The square is unavoidable; everyone meets. Widows eat with neighbours because isolation is structurally impossible. Researchers call it 'non-design design': health produced not by choices but by a built environment that makes the healthy choice the lazy one. The lesson travels badly, which is the point. You cannot bottle the village. The supplement aisle sells the wine and the beans, but the stairs and the square — the actual medicine — refuse to fit in capsules.",
    qs: [
      { type: "tf", q: "The elders' advantage is mainly explained by their genes.", a: "F", why: "correlates most strongly with geography of a social kind —— 是地理与社会结构。" },
      { type: "tf", q: "Widows in the village often eat alone.", a: "F", why: "Widows eat with neighbours because isolation is structurally impossible。" },
      { type: "mc", q: "'Non-design design' means health comes from:", opts: ["A. medical checkups", "B. an environment that makes the healthy choice the easy one", "C. expensive diets", "D. exercise equipment"], a: 1, why: "a built environment that makes the healthy choice the lazy one。" },
      { type: "sa", q: "Why does the lesson 'travel badly'?", a: "Because the real medicine is the environment — stairs and squares — which cannot be packaged and sold like supplements.", why: "末两句的转述。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "In 1899, a patent clerk wrote, in a footnote of his spare-time physics, that no experiment could distinguish uniform motion from rest. Footnotes are where careers go to hide, but this one became the foundation of relativity. Historians of science use the story to make a point about 'prepared minds': the clerk had spent years on railway timing patents, immersed in the unglamorous problem of synchronising distant clocks — exactly the conceptual toolkit relativity needed. The myth prefers the lone genius struck by lightning; the record shows a technician whose day job handed him the key. The pattern repeats so often it deserves a law: breakthroughs migrate to whoever is already standing where two fields meet, complaining about the paperwork.",
    qs: [
      { type: "tf", q: "The footnote was part of the clerk's official patent work.", a: "F", why: "in a footnote of his spare-time physics。" },
      { type: "tf", q: "Railway clock synchronisation was directly relevant to relativity.", a: "T", why: "immersed in ... synchronising distant clocks — exactly the conceptual toolkit relativity needed。" },
      { type: "mc", q: "The myth of discovery prefers the image of:", opts: ["A. teamwork", "B. a lone genius struck by lightning", "C. patient administration", "D. lucky accidents in labs"], a: 1, why: "The myth prefers the lone genius struck by lightning。" },
      { type: "sa", q: "What 'law' does the author propose?", a: "Breakthroughs migrate to whoever is already standing where two fields meet.", why: "末句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Grocery stores discovered years ago that loyalty cards are not about loyalty. The discounts are real, but the product is the data: a decade of your Tuesdays, recorded in barcodes. The trade seemed fair until pricing software learned to act on it individually. Economists call the endpoint 'first-degree price discrimination' — every customer paying a personal maximum — and note its quiet arrival: digital shelf labels that can change a price between morning and evening, app coupons tuned to what you have historically paid. Regulators struggle because the practice wears the costume of a discount. The old economy's rule, that the price tag was the same for everyone, turns out to have been a technological accident — paper labels — rather than a principle, and accidents do not survive the tools that replace them.",
    qs: [
      { type: "tf", q: "Loyalty cards exist mainly to reward faithful customers.", a: "F", why: "loyalty cards are not about loyalty ... the product is the data。" },
      { type: "tf", q: "'First-degree price discrimination' means charging each customer a personal maximum.", a: "T", why: "every customer paying a personal maximum。" },
      { type: "mc", q: "Regulators struggle because:", opts: ["A. the technology is foreign", "B. personalised pricing disguises itself as discounts", "C. prices are too low", "D. customers complain too much"], a: 1, why: "the practice wears the costume of a discount。" },
      { type: "sa", q: "What 'technological accident' does the author identify?", a: "Equal prices for everyone resulted from paper labels, not principle — and digital labels end the accident.", why: "倒数第二句的转述。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The hajj pilgrimage moved five million people a year through one valley, and for decades the mathematics of the crowd defeated engineers. Stampedes killed hundreds in repeated years, always at the same junctions. The breakthrough came not from bigger barriers but from a physicist's video analysis: crowds above a certain density stop behaving like crowds and start behaving like fluids, transmitting pressure waves that no individual chooses or can resist. The redesign — one-way flows, timed entrances, a bridge rebuilt as five one-directional decks — treated people explicitly as particles. Deaths fell to near zero. The episode is cited whenever planners meet public anger: the deadliest crowd disasters, it demonstrates, are rarely stampedes of panic. They are engineering failures wearing the mask of human blame.",
    qs: [
      { type: "tf", q: "The disasters were caused mainly by crowd panic.", a: "F", why: "rarely stampedes of panic ... engineering failures。" },
      { type: "tf", q: "Above a critical density, crowds behave like fluids.", a: "T", why: "stop behaving like crowds and start behaving like fluids。" },
      { type: "mc", q: "The bridge was rebuilt as:", opts: ["A. two wider lanes", "B. five one-directional decks", "C. a tunnel", "D. a moving walkway"], a: 1, why: "a bridge rebuilt as five one-directional decks。" },
      { type: "sa", q: "What general lesson do planners cite from the episode?", a: "Deadly crowd disasters are usually engineering failures, not individual panic — blame should shift from people to design.", why: "末句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "A study of diary-keeping asked volunteers to predict, each evening, how they would feel about today's events in a year. The errors were systematic and strange: participants over-predicted the lasting pain of embarrassments and under-predicted the lasting warmth of small kindnesses — a bus-stop conversation, a stranger's returned glove. Psychologists already knew we are poor forecasters of emotion; the diaries showed the errors are not random but tilted. We discount the ordinary precisely because it is ordinary, forgetting that memory edits ruthlessly and keeps disproportionately what felt shared. The diarists' year-later entries read like corrections: the feared things faded to anecdotes, while the unnoticed kindnesses had quietly become the plot. The data suggests a revision of effort: we schedule the impressive and neglect the connective, though only the latter survives the editor.",
    qs: [
      { type: "tf", q: "Participants accurately predicted which events would matter in a year.", a: "F", why: "The errors were systematic —— 预测系统性出错。" },
      { type: "tf", q: "People underestimate the lasting warmth of small kindnesses.", a: "T", why: "under-predicted the lasting warmth of small kindnesses。" },
      { type: "mc", q: "According to the passage, memory keeps:", opts: ["A. everything equally", "B. mostly embarrassing moments", "C. disproportionately what felt shared", "D. only painful events"], a: 2, why: "keeps disproportionately what felt shared。" },
      { type: "sa", q: "What 'revision of effort' does the data suggest?", a: "We should stop scheduling the impressive and neglecting the connective, since only connection survives memory's editing.", why: "末句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The Dutch village of Giethoorn has no roads in its old centre, only canals and footpaths, and the post is delivered by boat. Tourists photograph the quiet; urbanists photograph something else — the logistics that quiet requires. Garbage trucks cannot enter, so waste is boated out; furniture arrives by barge; the fire service keeps shallow-draught boats. The village is not an escape from engineering but a wager on it: every car-banished metre is paid for in redesigned infrastructure, and the silence tourists enjoy is budgeted like a utility. The lesson inverts a common fantasy. Tranquillity, Giethoorn demonstrates, is not the absence of systems but their most expensive product — the difference between a village and a painting of a village is the unglamorous plumbing of delivery, and someone still has to boat out the rubbish.",
    qs: [
      { type: "tf", q: "Giethoorn's old centre is entirely car-free.", a: "T", why: "has no roads in its old centre。" },
      { type: "tf", q: "The village functions without any engineered systems.", a: "F", why: "not an escape from engineering but a wager on it。" },
      { type: "mc", q: "Waste in Giethoorn is removed by:", opts: ["A. underground pipes", "B. boat", "C. bicycle carts", "D. drone"], a: 1, why: "waste is boated out。" },
      { type: "sa", q: "What is the author's central claim about tranquillity?", a: "Tranquillity is not the absence of systems but their most expensive product — it must be designed and paid for.", why: "倒数第二句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The Himalaya's most important weather station is a jet stream. Each spring, winds a hundred kilometres high shift direction, and five hundred million farmers' calendars hang on the timing. Monsoon prediction has improved enormously — five-day forecasts now rival one-day forecasts of the 1980s — yet the arrival date of the rains still strays by weeks, and the cost of the error is measured in planting decisions made on faith. Climate scientists note the strange asymmetry: we forecast the monsoon better each decade while understanding it less confidently, because the old signposts, snowpack and sea temperatures, are themselves moving. It is a portrait of prediction everywhere in a warming century: the models sharpen while the reference points blur, and the farmer's real question — 'will this year be like the ones I remember?' — is the one no forecast can answer anymore.",
    qs: [
      { type: "tf", q: "Five-day monsoon forecasts now match the accuracy of 1980s one-day forecasts.", a: "T", why: "five-day forecasts now rival one-day forecasts of the 1980s。" },
      { type: "tf", q: "The rains' arrival date is now predicted precisely.", a: "F", why: "the arrival date of the rains still strays by weeks。" },
      { type: "mc", q: "The 'strange asymmetry' is that:", opts: ["A. forecasts improve while understanding grows less confident", "B. farmers ignore forecasts", "C. snowpack is increasing", "D. forecasts are getting worse"], a: 0, why: "we forecast the monsoon better each decade while understanding it less confidently。" },
      { type: "sa", q: "What question can no forecast answer for the farmer?", a: "'Will this year be like the ones I remember?' — whether the future will resemble past experience.", why: "末句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "When deaf children in Nicaragua were first gathered in one school in the 1980s, teachers tried to teach them Spanish. The children, instead, taught each other something unprecedented: within a decade, their improvised home signs had merged, regularised and acquired grammar — a new language, created by children, documented by linguists arriving mid-birth. The older children's version was simpler; the youngest arrivals, learning from slightly older peers rather than adults, added complexity each cohort. Language, the episode demonstrated, is not merely learned but generated, and the generative engine runs hottest in the young. For linguistics it was a once-ever experiment no ethics board would permit: watch grammar ignite. For everyone else it is a quieter proof — that a mind denied a language does not stay silent. It builds one.",
    qs: [
      { type: "tf", q: "Teachers at the school invented the new sign language.", a: "F", why: "The children ... taught each other —— 是孩子创造的。" },
      { type: "tf", q: "Each younger cohort added complexity to the language.", a: "T", why: "the youngest arrivals ... added complexity each cohort。" },
      { type: "mc", q: "For linguists, the episode was unique because:", opts: ["A. it was funded generously", "B. it let them watch grammar being created in real time", "C. it happened in a city", "D. adults designed it"], a: 1, why: "watch grammar ignite —— 亲眼见证语法诞生。" },
      { type: "sa", q: "What is the 'quieter proof' for everyone else?", a: "A mind denied a language does not stay silent — it builds one.", why: "末两句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "An insurance company analysed decades of claims and found a pattern no safety campaign had targeted: the most dangerous hour on the road is not midnight but mid-afternoon, when schools empty and attention, not alcohol, is the missing ingredient. Follow-up research quantified the mechanism — 'attentional blink', the half-second hole in perception that follows any distraction — and measured how routine drives inflate it. Familiar roads are statistically worse than strange ones; the brain, bored, delegates driving to habit and checks out. Safety engineers draw a conclusion that frustrates advertisers: the danger is not the phone but the ordinary, and no device ban touches the school-run trance. The honest fix is unglamorous — treat the familiar route as the risky one, since familiarity, not difficulty, is what disarms attention.",
    qs: [
      { type: "tf", q: "Midnight is the most dangerous hour on the road, according to the claims data.", a: "F", why: "not midnight but mid-afternoon。" },
      { type: "tf", q: "Familiar roads are statistically safer than strange ones.", a: "F", why: "Familiar roads are statistically worse。" },
      { type: "mc", q: "'Attentional blink' is:", opts: ["A. falling asleep while driving", "B. a half-second gap in perception after a distraction", "C. a type of eyesight problem", "D. a phone notification"], a: 1, why: "the half-second hole in perception that follows any distraction。" },
      { type: "sa", q: "What is the 'honest fix' the author proposes?", a: "Treat the familiar route as the risky one, because familiarity — not difficulty — disarms attention.", why: "末句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The British Library's sound archive holds a recording nobody can name: two minutes of birdsong from 1890, the oldest surviving recording of wildlife, made by an amateur who simply pointed an early phonograph at his aviary. Archivists value it for a reason that is easy to miss. The bird species is common, the recording quality awful; what is priceless is the baseline. Every subsequent decade of recordings can be compared against it — and they show that the same species now sings higher and faster, drowned out of its low notes by traffic. The archive's curators call such recordings 'fossils of the future': documents boring in their own time that become irreplaceable evidence in ours. It is an argument for recording the unremarkable now, since no one can say which of today's background noise is tomorrow's missing data.",
    qs: [
      { type: "tf", q: "The 1890 recording features a rare, extinct bird.", a: "F", why: "The bird species is common。" },
      { type: "tf", q: "The same species now sings higher and faster than in 1890.", a: "T", why: "now sings higher and faster, drowned out of its low notes by traffic。" },
      { type: "mc", q: "'Fossils of the future' are:", opts: ["A. ancient animal remains", "B. boring documents that later become irreplaceable evidence", "C. predictions about climate", "D. museum display cases"], a: 1, why: "documents boring in their own time that become irreplaceable evidence in ours。" },
      { type: "sa", q: "What argument do the curators make for recording the ordinary?", a: "Nobody knows which of today's background noise is tomorrow's missing data, so the unremarkable should be recorded now.", why: "末句原句。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "A vineyard in Bordeaux made the front pages by hiring sheep. The animals graze between the vines, eating weeds, fertilising as they go, and replacing both the herbicide sprayer and the diesel mower. The economics surprised the accountants: the sheep cost less than the machinery they replaced, and the wool, sold to a local mill, turned the weeding budget into a minor revenue line. Agronomists see a larger pattern called 'integrated agriculture' — recombining plants and animals that industrial farming spent a century separating for efficiency. The separation had hidden costs on both sides: fields needed chemicals, barns needed imported feed. The reunion is not nostalgia; the sheep wear GPS collars, and the vineyard's data systems track them like tractors. It is, the farmer says, simply farming where nothing has a single job.",
    qs: [
      { type: "tf", q: "The sheep cost more than the machinery.", a: "F", why: "the sheep cost less than the machinery they replaced。" },
      { type: "tf", q: "Wool sales turned weeding into a small source of income.", a: "T", why: "turned the weeding budget into a minor revenue line。" },
      { type: "mc", q: "'Integrated agriculture' means:", opts: ["A. fully automated farming", "B. recombining plants and animals industrial farming separated", "C. organic certification", "D. urban farming"], a: 1, why: "recombining plants and animals that industrial farming spent a century separating。" },
      { type: "sa", q: "What does 'farming where nothing has a single job' mean?", a: "Every element serves multiple functions — the sheep weed, fertilise, mow and produce wool at once.", why: "对末句的转述。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "The resume gap is hiring's oldest stigma, and economists finally measured it. Sending thousands of fictitious applications, they found that a six-month unexplained gap cut callbacks by half — roughly the same penalty as having served a short prison sentence. Then they ran the experiment's clever second act: on half the gap resumes, one line of explanation — 'caring for a parent', 'retraining' — erased most of the penalty. The gap itself, it turned out, was not the problem; the silence was. Hiring, like all fast judgement, runs on narrative, and an unexplained hole invites the reader to write their own story, always worse than the truth. The finding reframes career advice. The risk of a gap is not the time away but the vacuum it leaves in the account of you — and vacuums, in hiring as in physics, get filled by whatever rushes in first.",
    qs: [
      { type: "tf", q: "A six-month gap cut callbacks by half.", a: "T", why: "cut callbacks by half。" },
      { type: "tf", q: "Explanations made the penalty worse.", a: "F", why: "one line of explanation ... erased most of the penalty。" },
      { type: "mc", q: "The real problem with an unexplained gap is:", opts: ["A. lost skills", "B. the silence, which lets readers invent a worse story", "C. salary expectations", "D. references"], a: 1, why: "the silence was [the problem] ... invites the reader to write their own story, always worse than the truth。" },
      { type: "sa", q: "What does the vacuum metaphor mean for job seekers?", a: "An unexplained gap creates a narrative vacuum that gets filled by the worst assumptions, so provide your own explanation first.", why: "末句的转述。" },
    ],
  },
  {
    t: "读", cn: "阅读短文，完成文后的 4 道阅读题", en: "Read the passage and answer the questions.",
    passage: "Lighthouses were economics' favourite impossible business: the light is free to every ship that sees it, so who would ever pay? Textbooks used them for a century to prove some goods must be public. Then a historian checked the records and found the textbooks wrong: for centuries, English lighthouses were private, funded by tolls collected at ports — shipowners paid because harbour insurers demanded it, and insurers demanded it because wrecked cargo cost them money. The lesson cut deeper than the correction. The 'impossible' market had existed for generations, held together not by law but by a chain of interested parties who each found it cheaper to fund light than fund wrecks. Economists now teach the case in reverse: when a service seems unprofitable, look first for who silently profits from it, since the payer and the user are so rarely the same person.",
    qs: [
      { type: "tf", q: "Textbooks long used lighthouses to argue some goods must be public.", a: "T", why: "Textbooks used them for a century to prove some goods must be public。" },
      { type: "tf", q: "English lighthouses were always government-run.", a: "F", why: "for centuries, English lighthouses were private。" },
      { type: "mc", q: "Shipowners paid lighthouse tolls because:", opts: ["A. the law forced them directly", "B. harbour insurers demanded it to cut wreck losses", "C. sailors voted for it", "D. ports were tax-free"], a: 1, why: "shipowners paid because harbour insurers demanded it。" },
      { type: "sa", q: "What reversed lesson do economists now teach from the case?", a: "When a service seems unprofitable, look for who silently profits — the payer and the user are rarely the same person.", why: "末句原句。" },
    ],
  },
];
