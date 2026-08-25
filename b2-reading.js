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
];
