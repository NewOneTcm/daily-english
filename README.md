# 每天用英语（Daily English）

一个「用英语」而不是「学英语」的每日习惯工具。单文件、离线、无需安装。

> A zero-install, offline, single-file habit tool that makes you **use** English every day:
> one real-world task card at boot (listen / speak / read / write, 3–5 minutes), streaks, instant local
> feedback on your writing (offline rule engine + optional AI coach), and spaced review
> that can be exported straight into SuperMemo. Open `index.html` — that's it.

## 设计理念

- **重点是用**：每天一张真实场景任务卡（写邮件、回消息、开口吐槽、讲观点），不是背单词、刷语法
- **听说读写轮换**：任务卡按 听 → 说 → 读 → 写 轮换推进，四科均衡练习；「记录」页有四科分布统计
- **启动零成本**：已加入 Windows 开机启动，打开电脑它就出现在浏览器里
- **任务足够小**：3-5 分钟说完/写完就打卡走人，靠连续天数而不是意志力维持
- **有反馈**：打卡后本地点评引擎立刻标出典型错误（I am agree、people is、in the internet 这类高频坑）；可选配置任何兼容 OpenAI 格式的 API 获得 AI 深度点评
- **反馈进复习**：每条反馈一键「存为复习点」，进入间隔复习队列，和表达库一起可导出 SuperMemo
- **复习可外置**：内置轻量间隔复习（忘了/模糊/记得）应急够用；想要正经的长期记忆，一键导出 SuperMemo Q&A 文本，交给 SuperMemo 处理

## 四种任务

| 类型 | 怎么玩 |
| --- | --- |
| 🎧 听 | 浏览器内置语音（TTS）朗读一篇按级别选材的短文，语速随级别 0.7x-1.05x。先盲听 2-3 遍，再看原文、完成检验问题 |
| 🎙 说 | 开口任务（观点、复述、即兴演讲），带计时器，出声就算 |
| 📖 读 | 读一篇按级别递进的短文（便条→评论→论述→讽刺），然后用英语回应：复述、表态、仿写 |
| ✍️ 写 | 真实场景写作（邮件、动态、差评、立场文），写完自动触发本地点评 |

听力用系统自带的英语语音（Windows 自带 Microsoft 英文语音包，离线可用），无需联网。

## 使用

1. 双击 `index.html`（或等开机自动弹出），首次选择英语级别（A1-C2），选不准就选低一级
2. 每天打开：看任务卡 → 说/写 → 打卡 → 顺手存一条表达
3. 打卡后看「本次反馈」：本地点评自动标出错误并给出正确说法，有价值的点「存为复习点」
4. 表达和复习点到期后「复习」标签会出现红色角标，看中文说英文，两分钟过完
5. 级别随时可以点右上角级别徽章调整；在同一级别打卡满 14 次会建议升级

## 反馈系统

- **本地点评**（离线，零配置）：15+ 条中国学习者高频错误规则（三单、不可数名词、although/but 混用、because/so 混用等）+ 长度、重复用词、长句、连接词、大小写检查
- **AI 深度点评**（可选）：「记录」页配置接口地址 + 模型 + API Key，支持任何 OpenAI 格式接口；配置后先点「测试连接」确认通畅
  - Kimi：`https://api.moonshot.cn/v1`，模型如 `kimi-k2-0905-preview`
  - DeepSeek：`https://api.deepseek.com/v1`，模型 `deepseek-chat`
  - OpenRouter：`https://openrouter.ai/api/v1`
  - 注意地址只填到 `/v1`，不要带 `/chat/completions`
- 两类反馈都可以存为复习点，进入「看中文回忆正确英文表达」的复习流程；复习点在表达库中带「反馈」标签
- AI Key 只保存在本机浏览器 localStorage，注意它会包含在导出的 JSON 备份里

## 导出到 SuperMemo

「复习」或「表达库」页点「导出 SuperMemo」，得到 `Q:` / `A:` 格式的 UTF-8 文本文件。
在 SuperMemo 中：**File → Import → Q&A text** 选择该文件即可批量导入。
方向是「看中文回忆英文」（产出导向），配合本工具的「用」的目标。

## 数据

- 全部数据存在浏览器 localStorage（file:// 协议下按浏览器持久化）
- 建议固定用同一个浏览器打开（开机启动的快捷方式会用默认浏览器）
- 「记录」页可导出/导入 JSON 备份，换设备或重装前记得备份

## 文件

- `index.html` — 全部应用（HTML + CSS + JS，单文件）
- `README.md` — 本文件
- 开机启动项：`shell:startup` 里的 `DailyEnglish.lnk` 快捷方式

## 任务库

6 个级别 × 12 张任务卡（听说读写各 3 张）= 72 个场景，按日期轮换，当天可手动换卡。
想加自己的场景，直接编辑 `index.html` 里的 `TASKS` 对象即可。
