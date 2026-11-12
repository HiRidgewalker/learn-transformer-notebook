type LessonStep = { title: string; body: string; example: string; formula?: string };
type Lesson = {
  id: string; no: string; eyebrow: string; title: string; en: string; summary: string;
  question: string; formula: string; input: string; output: string;
  steps: LessonStep[]; insight: string; caution: string; duration: string;
};
const LESSONS: Lesson[] = [
  {
    id: 'overview', no: '00', eyebrow: '学习地图', title: '一眼看懂 Transformer', en: 'The Big Picture',
    summary: '把文本变成可计算的向量，让词与词交换信息，再一步一步预测输出。先看清整条路线，再钻进每个公式。',
    question: '经典 Transformer 的每个模块分别干什么？',
    formula: String.raw`\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V`,
    input: '源文本 / 目标前缀', output: '下一个 Token 的概率', duration: '8 min',
    steps: [
      {title:'输入先变成数字',body:'Tokenizer 先把文字切成 Token，再映射到 Token ID；Embedding 表按 ID 找到向量；位置编码补充顺序信息。',example:'「我 爱 你」→ [4,5,6] → 三行向量'},
      {title:'Encoder 读懂源句',body:'Self-Attention 允许每个源 Token 关注所有有效源位置。FFN 再逐位置加工表示，残差与归一化帮助稳定信息传递。',example:'得到 H_enc，每行代表一个源位置的上下文信息'},
      {title:'Decoder 逐步准备输出',body:'Masked Self-Attention 只看当前及之前的目标位置；Cross-Attention 再用目标侧 Q 查询源句的 K、V。',example:'<bos> → 预测 I → 输入 <bos> I → 预测 love'},
      {title:'投影、训练或生成',body:'输出层把隐藏向量变成词表 Logits。训练时计算 Loss 并反向传播；推理时选择一个 Token 追加到前缀。',example:'Logits → Softmax → Token 预测'}
    ],
    insight:'经典 Transformer 是 Encoder–Decoder 架构。Attention、FFN、Add & Norm 在其中协同工作，而不是彼此替代。',
    caution:'这个教程使用小型教学数值展示算法，不是实际训练好的翻译模型。'
  },
  {
    id:'tokenizer', no:'01', eyebrow:'输入基础', title:'从文字到 Token ID', en:'Tokenizer & Vocabulary',
    summary:'Tokenizer 是 Transformer 前面的独立处理组件；它把文本变成离散的 Token，再根据固定词表映射为整数 ID。',
    question:'一段话如何变成模型能够读取的编号？', formula:String.raw`\text{Text}\longrightarrow[t_1,\ldots,t_n]\longrightarrow[id_1,\ldots,id_n]`,
    input:'我喜欢编程', output:'[10,25,38]', duration:'7 min',
    steps:[
      {title:'先有一份词表',body:'词表通常在预训练前，用 BPE、WordPiece 等算法从大量文本中构建。ID 是词表中的稳定索引。',example:'教学词表：我→10，喜欢→25，编程→38'},
      {title:'依据分词规则切分',body:'Tokenizer 不保证每个 Token 恰好是一个词。常见 Token 是子词，也可能是字符或字节。',example:'「我喜欢编程」→ [我, 喜欢, 编程]（教学切法）'},
      {title:'查词表，得到 ID',body:'把每个 Token 映射成唯一的整数。一个句子最终是一个整数数组。',example:'[我, 喜欢, 编程] → [10, 25, 38]'},
      {title:'不需要收录所有完整单词',body:'遇到不在词表中的完整单词，可以拆成更小单元。字节级 BPE 能通过字节组合覆盖任意有效 UTF-8 文本。',example:'players → play + er + s（示意）'}
    ], insight:'Tokenizer 的规则通常先于模型权重确定；Token ID 不是语义向量，只是索引。',
    caution:'本页实验使用一个特意缩小的教学词表。未收录字符显示 <unk>，不等同于真实字节级 BPE。'
  },
  {
    id:'embedding',no:'02',eyebrow:'输入基础',title:'Token ID 如何找到向量',en:'Token Embedding',
    summary:'Embedding 是一张可学习的二维参数表。Token ID 直接充当行索引，取出对应的向量；向量数值通常在模型训练时共同学习。',
    question:'为什么一个整数 ID 就能对应一组小数？',formula:String.raw`E\in\mathbb R^{V\times d_{model}},\qquad x_i=E[id_i]`,
    input:'Token ID = 25',output:'[0.5,0.1,0.2,0.3]',duration:'7 min',
    steps:[
      {title:'确定矩阵大小',body:'假设词表有 V=10000 个 Token，每个向量有 d_model=4 维，就需要一张 10000×4 的 Embedding 表。',example:'每行属于一个 Token ID；每列属于一个向量特征。'},
      {title:'用 ID 直接索引',body:'读取 E[25]，就会得到第 25 行的四个数。没有“按相似度搜索词向量”这一步。',example:'E[25] → [0.5,0.1,0.2,0.3]'},
      {title:'初始化不是语义学习',body:'刚创建模型时这些参数通常随机初始化。参数训练之前，这些数字一般没有可靠的语义意义。',example:'创建 nn.Embedding(...) 是创建可训练参数，不是加载词典释义。'},
      {title:'跟模型其他参数一起更新',body:'Loss 通过反向传播传给 Embedding 表，优化器更新相关行；Attention 与 FFN 参数也可以同步训练。',example:'梯度 → 优化器 → E 的数值逐渐更新'}
    ],insight:'同一个 Token ID 查同一张表，初始 Embedding 相同；加入位置和上下文后，不同位置的隐藏状态可以不同。',
    caution:'词表 ID 的大小不代表语义大小；Token 25 并不比 Token 10“更重要”。'
  },
  {
    id:'position',no:'03',eyebrow:'输入基础',title:'数字怎样记住先后顺序',en:'Sinusoidal Positional Encoding',
    summary:'Self-Attention 本身没有固定的序列次序概念。原始 Transformer 通过不同频率的正弦和余弦，为每个位置生成位置向量。',
    question:'为什么位置 0 与位置 1 得到的向量不一样？',formula:String.raw`PE_{pos,2i}=\sin\left(\frac{pos}{10000^{2i/d}}\right),\quad PE_{pos,2i+1}=\cos\left(\frac{pos}{10000^{2i/d}}\right)`,
    input:'位置 pos = 1，维度 d = 4',output:'[0.8415,0.5403,0.0100,0.99995]',duration:'10 min',
    steps:[
      {title:'每两个维度是一组',body:'第 0、1 维共用 i=0 的频率：一个用 sin，一个用 cos。第 2、3 维共用 i=1 的频率。',example:'d=4 时，分母分别是 1 和 100。'},
      {title:'代入具体位置',body:'当 pos=1 时，前两维是 sin(1)、cos(1)；后两维是 sin(0.01)、cos(0.01)。',example:'PE(1) ≈ [0.8415,0.5403,0.0100,0.99995]'},
      {title:'与 Embedding 逐维相加',body:'原始论文中的一类实现先把 Embedding 乘以 √d_model，再加上同维度的位置编码。',example:'X_pos = √d_model·E[id] + PE(pos)'},
      {title:'不同频率编码不同尺度',body:'前面的维度变化快，后面的维度变化慢，组合起来帮助区分位置并学习相对位置信息。',example:'位置变化 1 时，sin(pos) 与 sin(pos/100) 的变化速度不同。'}
    ],insight:'位置编码没有增加 Token 数量，也没有把四维向量拼接为八维；它逐元素加入原本的输入表示。',
    caution:'这是原始 Transformer 的经典绝对位置编码；现代模型还常用 RoPE 等其他方案。'
  },
  {
    id:'attention',no:'04',eyebrow:'注意力核心',title:'注意力到底在哪里发生',en:'Scaled Dot-Product Attention',
    summary:'Attention 先为 Token 构造 Q、K、V，再用 Q·K 给匹配打分，经 Softmax 变成权重，最后按权重汇聚 V。',
    question:'一个 Token 如何决定自己应该关注哪些位置？',formula:String.raw`\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V`,
    input:'一个 Q + 三个 K/V',output:'一个新的上下文向量',duration:'14 min',
    steps:[
      {title:'投影得到 Q、K、V',body:'同一层的各个 Token 共用 W_Q、W_K、W_V，但因为输入不同，得到的 Q、K、V 通常不同。权重矩阵是训练出来的。',example:'Q=XW_Q；K=XW_K；V=XW_V'},
      {title:'点积打分并缩放',body:'当前 Q 与每个 K 对应元素相乘再求和；因为本例 d_k=2，所以所有分数都除以 √2。',example:'q=[1,0]，K=[[1,0],[0,1],[1,1]] → [1,0,1]/√2'},
      {title:'Softmax 变成权重',body:'指数化并归一化，让三项权重都非负且总和为 1。权重大通常表示当前 Q 对该 K 的匹配更强。',example:'[0.7071,0,0.7071] → [0.4011,0.1978,0.4011]'},
      {title:'按照权重汇聚 V',body:'每个 V 乘对应权重，再逐维相加。最终得到当前 Query 的新表示。',example:'0.4011[1,0]+0.1978[0,2]+0.4011[3,1] ≈ [1.6044,0.7967]'}
    ],insight:'Attention 是动态分配权重并汇聚信息的一整套过程。Softmax 的输出是“注意力权重”最直接的数值体现。',
    caution:'点积评分受向量长度与方向共同影响；“权重大”不意味着对应 Token 在人类语言学意义上必然更重要。'
  },
  {
    id:'multihead',no:'05',eyebrow:'注意力核心',title:'为什么一个注意力头不够',en:'Multi-Head Attention',
    summary:'多个注意力头分别学习不同的 Q、K、V 投影视角，再把各自的结果拼接，经输出投影合为一个向量。',
    question:'两个注意力头怎样变成一个最终结果？',formula:String.raw`\operatorname{MHA}(X)=\operatorname{Concat}(head_1,\ldots,head_h)W_O`,
    input:'两个注意力头，各输出 2 维',output:'拼接为 4 维，再输出投影',duration:'9 min',
    steps:[
      {title:'每个头有自己的参数',body:'不同注意力头使用不同的投影矩阵，能够从不同的特征角度计算关系；同一头内的 Token 共享该头的矩阵。',example:'head₁ 使用 W_Q¹/W_K¹/W_V¹；head₂ 使用另一组矩阵。'},
      {title:'每个头独立做 Attention',body:'每个头都经过 QK 点积、缩放、Softmax、V 加权求和。',example:'head₁=[1.6,0.8]，head₂=[0.2,1.1]（示意）'},
      {title:'Concat 只是拼接',body:'把两个二维结果首尾接起来，形成四维向量，不是相加。',example:'[1.6,0.8] ⊕ [0.2,1.1] = [1.6,0.8,0.2,1.1]'},
      {title:'输出投影 W_O',body:'拼接后的向量再乘一个可学习矩阵 W_O，融合不同头的信息并恢复 d_model 的维度。',example:'(1×4)(4×4) = 1×4'}
    ],insight:'多头增加的是并行“关系视角”，不是把一句话复制成多个 Token。',
    caution:'这里的二维头仅用于可视化；真实模型的头数和维度由架构配置决定。'
  },
  {
    id:'normalization',no:'06',eyebrow:'编码器构件',title:'Add & Norm 为什么不能省',en:'Residual Connection & LayerNorm',
    summary:'残差连接把子层输入直接加回输出；LayerNorm 则对每个 Token 的特征维度做数值标准化，并允许可学习的缩放与偏移。',
    question:'为什么输出要再加上原始输入，并对数值归一化？',formula:String.raw`Y=\operatorname{LN}(X+F(X)),\quad \operatorname{LN}(r)=\gamma\odot\frac{r-\mu}{\sqrt{\sigma^2+\varepsilon}}+\beta`,
    input:'X=[1,2,3,4]，F(X)=[0.1,-0.2,0.3,0]',output:'R=[1.1,1.8,3.3,4]',duration:'12 min',
    steps:[
      {title:'先 Add：走一条捷径',body:'Residual = X + F(X)。即使子层输出接近 0，输入仍可以通过这条捷径继续传递，并为反向传播提供更直接的梯度路径。',example:'[1,2,3,4] + [0.1,-0.2,0.3,0] → [1.1,1.8,3.3,4]'},
      {title:'计算该 Token 的均值',body:'把同一个 Token 的四个特征相加后除以 4。不是把句子中所有 Token 混在一起算。',example:'μ=(1.1+1.8+3.3+4)/4=2.55'},
      {title:'计算方差，再标准化',body:'每个数减均值、平方求平均得到方差，再除以 √(方差+ε)，避免数值尺度漂移。',example:'σ²=1.3325；标准化 ≈ [-1.256,-0.650,0.650,1.256]'},
      {title:'最后乘 γ，加 β',body:'γ、β 是逐维可学习参数，允许模型重新调整标准化后的尺度和偏移。',example:'Y = γ ⊙ 标准化向量 + β'}
    ],insight:'原始 Transformer 使用 Post-LN：先 Add，再 Norm。现代一些模型则使用 Pre-LN。',
    caution:'在 LN 的 γ、β 不等于 1 和 0 时，最终输出不一定仍然均值为 0、方差为 1。'
  },
  {
    id:'ffn',no:'07',eyebrow:'编码器构件',title:'FFN：每个 Token 的独立加工厂',en:'Position-wise Feed-Forward Network',
    summary:'FFN 对每个 Token 使用同一套参数独立计算，先升维、经过非线性激活，再降回原维度。它不在不同 Token 之间直接交换信息。',
    question:'为什么要把 4 维先变成 8 维，再变回 4 维？',formula:String.raw`\operatorname{FFN}(x)=\operatorname{ReLU}(xW_1+b_1)W_2+b_2`,
    input:'一个 Token 的 4 维向量',output:'新的 4 维向量',duration:'11 min',
    steps:[
      {title:'第一层：4→8',body:'输入一行四个数，与 4×8 的 W₁ 相乘，再加八维偏置 b₁。得到一个 Token 的八个中间特征。',example:'(1×4)(4×8) = 1×8'},
      {title:'ReLU：负数变为零',body:'对八个数分别执行 max(0,x)。例如 -0.7→0，1.2→1.2。非线性让两层不能简单合并成一次矩阵乘法。',example:'ReLU([-1,0.5,2]) = [0,0.5,2]'},
      {title:'第二层：8→4',body:'八维特征乘 8×4 的 W₂，加四维偏置 b₂，输出四维向量。',example:'(1×8)(8×4)=1×4'},
      {title:'各个 Token 各算各的',body:'每个 Token 都使用同一组 W₁、b₁、W₂、b₂，但输入不同，输出通常不同。',example:'FFN(我)、FFN(爱)、FFN(你) 共享权重，不互相做点积。'}
    ],insight:'Attention 让 Token 之间汇聚信息；FFN 在单个位置上进行非线性特征变换。',
    caution:'8 只是教学用扩展宽度；真实 Transformer 的 d_ff 往往比 d_model 大得多。'
  },
  {
    id:'mask',no:'08',eyebrow:'解码器构件',title:'Mask：让模型不能偷看答案',en:'Causal Mask & Padding Mask',
    summary:'Mask 不删除 Token，而是在 Softmax 之前禁止一些 Q-K 匹配，使不允许关注的位置最终获得零注意力权重。',
    question:'为什么当前位置看不到“未来”的 Token？',formula:String.raw`A=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}+M\right),\quad M_{ij}=\begin{cases}0&j\le i\\-\infty&j>i\end{cases}`,
    input:'评分 [1,2,3,4]，当前 Query 位置=2',output:'Mask 后 [1,2,3,-∞]',duration:'10 min',
    steps:[
      {title:'Causal Mask 规定可见范围',body:'目标位置 i 只允许关注 j≤i 的位置。右上角未来位置被遮挡；这是自回归 Decoder Self-Attention 的关键。',example:'当前 i=2 → 可以看 0、1、2；不能看 3。'},
      {title:'在 Softmax 之前加 Mask',body:'允许关注加 0，不变；禁止关注加 -∞，对应指数变成 0。',example:'[1,2,3,4]+[0,0,0,-∞]=[1,2,3,-∞]'},
      {title:'Softmax 给被遮挡位置 0 权重',body:'e^(-∞)=0，因此该位置不参与 Value 的加权求和。',example:'Softmax([1,2,3,-∞])≈[0.0900,0.2447,0.6652,0]'},
      {title:'Padding Mask 遮掉补齐位置',body:'不同长度的句子补齐为相同张量时，<pad> 不属于实际文本。Padding Mask 通常将这些 Key 列标为不可见。',example:'[我, 爱, <pad>] → 第 3 列不可关注'}
    ],insight:'Causal Mask 防止读取未来目标信息；Padding Mask 防止填充 Key 参与注意力。两者可以组合。',
    caution:'如果一整行都被标成 -∞，普通 Softmax 将出现数值问题；实际实现要保证或特殊处理有效位置。'
  },
  {
    id:'encoder',no:'09',eyebrow:'经典主架构',title:'Encoder：完整读懂输入句子',en:'Transformer Encoder',
    summary:'Encoder 使用无因果限制的 Self-Attention 汇聚源侧信息，再通过 Add & Norm、FFN、Add & Norm 得到每个源位置的上下文表示。',
    question:'一层 Encoder 内部到底走过哪些步骤？',formula:String.raw`U=\operatorname{LN}(X+\operatorname{MHA}(X)),\quad H=\operatorname{LN}(U+\operatorname{FFN}(U))`,
    input:'源句的 n×d_model 向量',output:'H_enc，形状仍为 n×d_model',duration:'10 min',
    steps:[
      {title:'Embedding + 位置编码',body:'n 个源 Token 各取一个 d_model 维向量，并加入位置表示，形成输入矩阵 X。',example:'「我 爱 你」→ X 的形状为 3×4'},
      {title:'Self-Attention 汇聚其他词',body:'同一组 X 产生 Q、K、V。每个源 Query 可读取所有有效源位置，没有自回归的“禁止未来”限制。',example:'3 个源位置 → 3×3 注意力矩阵'},
      {title:'第一次 Add & Norm',body:'MHA 的输出加上进入 MHA 之前的 X，然后逐 Token 做 LayerNorm。',example:'U=LN(X+MHA(X))'},
      {title:'FFN 与第二次 Add & Norm',body:'各 Token 独立做非线性变换，再加回 U 并做归一化。',example:'H_enc=LN(U+FFN(U))'}
    ],insight:'Encoder 的最终每一行仍对应一个输入 Token 位置，但已经融合了整句上下文。',
    caution:'经典模型可以堆叠多层 Encoder；本教程的单层流程只是在解释其中一层。'
  },
  {
    id:'decoder',no:'10',eyebrow:'经典主架构',title:'Decoder：一边看前缀，一边查询源句',en:'Transformer Decoder & Cross-Attention',
    summary:'经典 Decoder 先 Masked Self-Attention，再使用 Cross-Attention 读取 Encoder 输出，最后 FFN；三个子层之后都接 Add & Norm。',
    question:'Cross-Attention 的 Q、K、V 为什么来自不同地方？',formula:String.raw`Q=UW_Q,\quad K=H_{enc}W_K,\quad V=H_{enc}W_V`,
    input:'目标前缀 Y 与源句表示 H_enc',output:'每个目标位置的新隐藏向量 H_dec',duration:'13 min',
    steps:[
      {title:'Masked Self-Attention：只看目标前缀',body:'目标侧 Y 产生 Q、K、V；Causal Mask 限制只能读取当前与之前目标位置。结束后做 Add & Norm，得到 U。',example:'<bos> I love you：第 1 行不能看到后面的 love。'},
      {title:'Cross-Attention：目标 Q 查询源 K/V',body:'Q 来自目标 U，K 和 V 来自 Encoder 的 H_enc。目标 Query 可以读取所有有效源位置。',example:'4 个目标位置 × 3 个源位置 → 4×3 匹配矩阵。'},
      {title:'第二次 Add & Norm',body:'把 Cross-Attention 的输出加回它自己的输入 U，再做 LayerNorm，得到 C。',example:'C=LN(U+CrossMHA(U,H_enc))'},
      {title:'FFN + 第三次 Add & Norm',body:'对每个目标位置独立加工，并把 FFN 输入 C 加回去。最后得到 H_dec。',example:'H_dec=LN(C+FFN(C))'}
    ],insight:'Self-Attention 读目标前缀；Cross-Attention 读源句。经典 Encoder–Decoder 的关键差异就在这里。',
    caution:'Decoder 输出的是隐藏向量，不是直接生成的单词。下一步还需要词表投影。'
  },
  {
    id:'training',no:'11',eyebrow:'从预测到学习',title:'Training：模型怎样知道自己错了',en:'Logits · Teacher Forcing · Cross-Entropy',
    summary:'训练时用正确目标前缀构造 Decoder 输入，再将隐藏状态投影成词表评分，经 Softmax 得到概率；用交叉熵衡量错误，利用梯度反向更新参数。',
    question:'正确答案的预测概率为什么决定了 Loss？',formula:String.raw`\ell=-\log p_{\mathrm{correct}},\qquad \frac{\partial\ell}{\partial z_j}=p_j-\mathbf1[j=y]`,
    input:'Decoder 输出 + 正确目标 Token',output:'Loss 与模型参数梯度',duration:'14 min',
    steps:[
      {title:'Teacher Forcing：准备正确历史',body:'训练时已知目标句，把 <bos> I love you 作为 Decoder 输入，把 I love you <eos> 作为标签，二者错开一位。',example:'输入 <bos> I → 正确预测 love'},
      {title:'Logits → Softmax',body:'隐藏向量乘词表投影矩阵 W_vocab，得到各候选 Token 原始分数；Softmax 转成概率。',example:'[1,2,3] → [0.0900,0.2447,0.6652]'},
      {title:'Cross-Entropy：只看正确答案的概率',body:'单个位置的负对数似然是 -ln P(正确 Token)。正确概率越高，Loss 越小。',example:'p_correct=0.7 → Loss≈0.3567'},
      {title:'反向传播与梯度下降',body:'先计算每个 Logit 的梯度 p−onehot(y)，再通过链式法则传回权重，优化器更新可学习参数。',example:'θ_new=θ_old−学习率×梯度'}
    ],insight:'Teacher Forcing 使用正确的历史 Token；推理则使用模型刚刚生成的 Token。两者不能混为一谈。',
    caution:'本教程是教学用确定性算例，不会真正训练神经网络权重。'
  },
  {
    id:'generation',no:'12',eyebrow:'从预测到学习',title:'Generation：一个 Token 接着一个',en:'Autoregressive Inference',
    summary:'生成时 Encoder 先处理一次源句；Decoder 每轮读取当前前缀，只使用最后一个目标位置的概率选择下一个 Token，再追加，直到遇到停止条件。',
    question:'为什么生成整句话必须循环很多轮？',formula:String.raw`y_t=\arg\max_v P(v\mid y_{<t},x),\qquad prefix\leftarrow[prefix,y_t]`,
    input:'源句 + <bos>',output:'I love you <eos>（理想演示）',duration:'11 min',
    steps:[
      {title:'Encoder 先编码源句一次',body:'输入源句在这次翻译中不变，因此 H_enc 可以复用。Decoder 的目标前缀初始化为 [<bos>]。',example:'prefix=[2]'},
      {title:'读取最后一行概率',body:'如果当前前缀有 t 个 Token，Decoder 输出 t 行隐藏向量和 t 行词表概率。只有最后一行用于预测下一个位置。',example:'<bos> I → 读取第 1 行概率预测 love'},
      {title:'选出 Token 并追加',body:'Greedy Decoding 选择概率最大的 Token（argmax），将新 ID 加入 prefix，再进入下一轮。',example:'[<bos>] → [<bos>, I] → [<bos>, I, love]'},
      {title:'满足停止条件',body:'生成 <eos> 或达到预设最大长度就停止。生产模型可使用 KV Cache 优化反复计算，这里用完整前缀解释算法。',example:'<bos> I love you <eos> → 结束'}
    ],insight:'训练可以并行预测已知目标序列的位置；生成时未来 Token 未知，需要一步步决定。',
    caution:'理想输出仅用于说明流程。固定示例概率不能代表实际训练好的语言模型。'
  },
  {
    id:'glossary',no:'13',eyebrow:'随手速查',title:'Transformer 公式与术语速查',en:'Symbols & Mental Models',
    summary:'把容易混淆的词、矩阵形状和核心公式集中放在一页。迷路时回到这里，明确每个字母是从哪里来的。',
    question:'Q、K、V、Logits、Loss 等概念怎样快速区分？',formula:String.raw`\text{Token}\to\text{Embedding}\to\text{Attention}\to\text{FFN}\to\text{Logits}`, 
    input:'一道陌生公式',output:'明确符号、形状与用途',duration:'5 min',
    steps:[
      {title:'Token / ID / Embedding',body:'Token 是文本基本单元，ID 是词表索引，Embedding 是按这个索引查到的可训练向量。',example:'「喜欢」→25→[0.5,0.1,0.2,0.3]'},
      {title:'Q / K / V',body:'Q 用来查询，K 用来匹配，V 承载供汇聚的数值。QKᵀ 用来生成评分，不是直接输出 Token。',example:'Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V'},
      {title:'Residual / Norm / FFN',body:'Residual 是加回原输入；LayerNorm 是逐 Token 特征归一化；FFN 是逐 Token 非线性特征处理。',example:'LN(x+F(x))，FFN(x)=ReLU(xW₁+b₁)W₂+b₂'},
      {title:'Logits / Probability / Loss',body:'Logits 是未经归一化的评分；Softmax 得到概率；Loss 衡量正确答案的概率不足。',example:'−ln(0.9)=0.105；−ln(0.1)=2.303'}
    ],insight:'优先追踪“这个矩阵从哪个模块来、形状是什么、下一步拿它做什么”，比死记公式更可靠。',
    caution:'本页是经典 Encoder–Decoder Transformer 的速查，不覆盖全部现代 LLM 架构变体。'
  }
];

const GLOSSARY = [
  ['Token','Tokenizer 输出的文本基本单元；可以是词、子词、字符或字节。'],
  ['Token ID','某个 Token 在固定词表里的整数索引。'],
  ['Embedding','每个 Token ID 对应的一行可学习向量。'],
  ['d_model','Transformer 隐藏向量的宽度。'],
  ['Position Encoding','向输入向量提供 Token 位置信息的编码。'],
  ['Q / Query','用来向各个 Key 发起匹配的查询向量。'],
  ['K / Key','与 Query 做点积，计算匹配评分的键向量。'],
  ['V / Value','根据注意力权重被加权汇聚的值向量。'],
  ['Softmax','把任意实数评分转换为非负、总和为 1 的权重。'],
  ['Multi-Head','多组独立投影的注意力头，输出拼接后再映射。'],
  ['Residual','把子层原始输入绕路加回子层输出。'],
  ['LayerNorm','对每个 Token 的特征维度计算均值、方差并归一化。'],
  ['FFN','在每个 Token 位置独立运行的前馈网络。'],
  ['Causal Mask','在自回归 Self-Attention 中屏蔽未来 Key。'],
  ['Padding Mask','让补齐长度的 <pad> Key 不参与注意力。'],
  ['Cross-Attention','目标侧提供 Q，源侧 Encoder 输出提供 K、V。'],
  ['Logits','词表投影后的原始预测评分，不是概率。'],
  ['Teacher Forcing','训练时使用正确历史 Token，而非模型预测历史。'],
  ['Cross-Entropy','监督正确 Token 概率的负对数损失。'],
  ['Autoregressive','每轮预测一个 Token 并将它加入下一轮输入的生成方式。']
];
