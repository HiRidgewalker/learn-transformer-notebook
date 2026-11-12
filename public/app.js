const LESSONS = [
    {
        id: 'overview', no: '00', eyebrow: '学习地图', title: '一眼看懂 Transformer', en: 'The Big Picture',
        summary: '把文本变成可计算的向量，让词与词交换信息，再一步一步预测输出。先看清整条路线，再钻进每个公式。',
        question: '经典 Transformer 的每个模块分别干什么？',
        formula: String.raw `\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V`,
        input: '源文本 / 目标前缀', output: '下一个 Token 的概率', duration: '8 min',
        steps: [
            { title: '输入先变成数字', body: 'Tokenizer 先把文字切成 Token，再映射到 Token ID；Embedding 表按 ID 找到向量；位置编码补充顺序信息。', example: '「我 爱 你」→ [4,5,6] → 三行向量' },
            { title: 'Encoder 读懂源句', body: 'Self-Attention 允许每个源 Token 关注所有有效源位置。FFN 再逐位置加工表示，残差与归一化帮助稳定信息传递。', example: '得到 H_enc，每行代表一个源位置的上下文信息' },
            { title: 'Decoder 逐步准备输出', body: 'Masked Self-Attention 只看当前及之前的目标位置；Cross-Attention 再用目标侧 Q 查询源句的 K、V。', example: '<bos> → 预测 I → 输入 <bos> I → 预测 love' },
            { title: '投影、训练或生成', body: '输出层把隐藏向量变成词表 Logits。训练时计算 Loss 并反向传播；推理时选择一个 Token 追加到前缀。', example: 'Logits → Softmax → Token 预测' }
        ],
        insight: '经典 Transformer 是 Encoder–Decoder 架构。Attention、FFN、Add & Norm 在其中协同工作，而不是彼此替代。',
        caution: '这个教程使用小型教学数值展示算法，不是实际训练好的翻译模型。'
    },
    {
        id: 'tokenizer', no: '01', eyebrow: '输入基础', title: '从文字到 Token ID', en: 'Tokenizer & Vocabulary',
        summary: 'Tokenizer 是 Transformer 前面的独立处理组件；它把文本变成离散的 Token，再根据固定词表映射为整数 ID。',
        question: '一段话如何变成模型能够读取的编号？', formula: String.raw `\text{Text}\longrightarrow[t_1,\ldots,t_n]\longrightarrow[id_1,\ldots,id_n]`,
        input: '我喜欢编程', output: '[10,25,38]', duration: '7 min',
        steps: [
            { title: '先有一份词表', body: '词表通常在预训练前，用 BPE、WordPiece 等算法从大量文本中构建。ID 是词表中的稳定索引。', example: '教学词表：我→10，喜欢→25，编程→38' },
            { title: '依据分词规则切分', body: 'Tokenizer 不保证每个 Token 恰好是一个词。常见 Token 是子词，也可能是字符或字节。', example: '「我喜欢编程」→ [我, 喜欢, 编程]（教学切法）' },
            { title: '查词表，得到 ID', body: '把每个 Token 映射成唯一的整数。一个句子最终是一个整数数组。', example: '[我, 喜欢, 编程] → [10, 25, 38]' },
            { title: '不需要收录所有完整单词', body: '遇到不在词表中的完整单词，可以拆成更小单元。字节级 BPE 能通过字节组合覆盖任意有效 UTF-8 文本。', example: 'players → play + er + s（示意）' }
        ], insight: 'Tokenizer 的规则通常先于模型权重确定；Token ID 不是语义向量，只是索引。',
        caution: '本页实验使用一个特意缩小的教学词表。未收录字符显示 <unk>，不等同于真实字节级 BPE。'
    },
    {
        id: 'embedding', no: '02', eyebrow: '输入基础', title: 'Token ID 如何找到向量', en: 'Token Embedding',
        summary: 'Embedding 是一张可学习的二维参数表。Token ID 直接充当行索引，取出对应的向量；向量数值通常在模型训练时共同学习。',
        question: '为什么一个整数 ID 就能对应一组小数？', formula: String.raw `E\in\mathbb R^{V\times d_{model}},\qquad x_i=E[id_i]`,
        input: 'Token ID = 25', output: '[0.5,0.1,0.2,0.3]', duration: '7 min',
        steps: [
            { title: '确定矩阵大小', body: '假设词表有 V=10000 个 Token，每个向量有 d_model=4 维，就需要一张 10000×4 的 Embedding 表。', example: '每行属于一个 Token ID；每列属于一个向量特征。' },
            { title: '用 ID 直接索引', body: '读取 E[25]，就会得到第 25 行的四个数。没有“按相似度搜索词向量”这一步。', example: 'E[25] → [0.5,0.1,0.2,0.3]' },
            { title: '初始化不是语义学习', body: '刚创建模型时这些参数通常随机初始化。参数训练之前，这些数字一般没有可靠的语义意义。', example: '创建 nn.Embedding(...) 是创建可训练参数，不是加载词典释义。' },
            { title: '跟模型其他参数一起更新', body: 'Loss 通过反向传播传给 Embedding 表，优化器更新相关行；Attention 与 FFN 参数也可以同步训练。', example: '梯度 → 优化器 → E 的数值逐渐更新' }
        ], insight: '同一个 Token ID 查同一张表，初始 Embedding 相同；加入位置和上下文后，不同位置的隐藏状态可以不同。',
        caution: '词表 ID 的大小不代表语义大小；Token 25 并不比 Token 10“更重要”。'
    },
    {
        id: 'position', no: '03', eyebrow: '输入基础', title: '数字怎样记住先后顺序', en: 'Sinusoidal Positional Encoding',
        summary: 'Self-Attention 本身没有固定的序列次序概念。原始 Transformer 通过不同频率的正弦和余弦，为每个位置生成位置向量。',
        question: '为什么位置 0 与位置 1 得到的向量不一样？', formula: String.raw `PE_{pos,2i}=\sin\left(\frac{pos}{10000^{2i/d}}\right),\quad PE_{pos,2i+1}=\cos\left(\frac{pos}{10000^{2i/d}}\right)`,
        input: '位置 pos = 1，维度 d = 4', output: '[0.8415,0.5403,0.0100,0.99995]', duration: '10 min',
        steps: [
            { title: '每两个维度是一组', body: '第 0、1 维共用 i=0 的频率：一个用 sin，一个用 cos。第 2、3 维共用 i=1 的频率。', example: 'd=4 时，分母分别是 1 和 100。' },
            { title: '代入具体位置', body: '当 pos=1 时，前两维是 sin(1)、cos(1)；后两维是 sin(0.01)、cos(0.01)。', example: 'PE(1) ≈ [0.8415,0.5403,0.0100,0.99995]' },
            { title: '与 Embedding 逐维相加', body: '原始论文中的一类实现先把 Embedding 乘以 √d_model，再加上同维度的位置编码。', example: 'X_pos = √d_model·E[id] + PE(pos)' },
            { title: '不同频率编码不同尺度', body: '前面的维度变化快，后面的维度变化慢，组合起来帮助区分位置并学习相对位置信息。', example: '位置变化 1 时，sin(pos) 与 sin(pos/100) 的变化速度不同。' }
        ], insight: '位置编码没有增加 Token 数量，也没有把四维向量拼接为八维；它逐元素加入原本的输入表示。',
        caution: '这是原始 Transformer 的经典绝对位置编码；现代模型还常用 RoPE 等其他方案。'
    },
    {
        id: 'attention', no: '04', eyebrow: '注意力核心', title: '注意力到底在哪里发生', en: 'Scaled Dot-Product Attention',
        summary: 'Attention 先为 Token 构造 Q、K、V，再用 Q·K 给匹配打分，经 Softmax 变成权重，最后按权重汇聚 V。',
        question: '一个 Token 如何决定自己应该关注哪些位置？', formula: String.raw `\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V`,
        input: '一个 Q + 三个 K/V', output: '一个新的上下文向量', duration: '14 min',
        steps: [
            { title: '投影得到 Q、K、V', body: '同一层的各个 Token 共用 W_Q、W_K、W_V，但因为输入不同，得到的 Q、K、V 通常不同。权重矩阵是训练出来的。', example: 'Q=XW_Q；K=XW_K；V=XW_V' },
            { title: '点积打分并缩放', body: '当前 Q 与每个 K 对应元素相乘再求和；因为本例 d_k=2，所以所有分数都除以 √2。', example: 'q=[1,0]，K=[[1,0],[0,1],[1,1]] → [1,0,1]/√2' },
            { title: 'Softmax 变成权重', body: '指数化并归一化，让三项权重都非负且总和为 1。权重大通常表示当前 Q 对该 K 的匹配更强。', example: '[0.7071,0,0.7071] → [0.4011,0.1978,0.4011]' },
            { title: '按照权重汇聚 V', body: '每个 V 乘对应权重，再逐维相加。最终得到当前 Query 的新表示。', example: '0.4011[1,0]+0.1978[0,2]+0.4011[3,1] ≈ [1.6044,0.7967]' }
        ], insight: 'Attention 是动态分配权重并汇聚信息的一整套过程。Softmax 的输出是“注意力权重”最直接的数值体现。',
        caution: '点积评分受向量长度与方向共同影响；“权重大”不意味着对应 Token 在人类语言学意义上必然更重要。'
    },
    {
        id: 'multihead', no: '05', eyebrow: '注意力核心', title: '为什么一个注意力头不够', en: 'Multi-Head Attention',
        summary: '多个注意力头分别学习不同的 Q、K、V 投影视角，再把各自的结果拼接，经输出投影合为一个向量。',
        question: '两个注意力头怎样变成一个最终结果？', formula: String.raw `\operatorname{MHA}(X)=\operatorname{Concat}(head_1,\ldots,head_h)W_O`,
        input: '两个注意力头，各输出 2 维', output: '拼接为 4 维，再输出投影', duration: '9 min',
        steps: [
            { title: '每个头有自己的参数', body: '不同注意力头使用不同的投影矩阵，能够从不同的特征角度计算关系；同一头内的 Token 共享该头的矩阵。', example: 'head₁ 使用 W_Q¹/W_K¹/W_V¹；head₂ 使用另一组矩阵。' },
            { title: '每个头独立做 Attention', body: '每个头都经过 QK 点积、缩放、Softmax、V 加权求和。', example: 'head₁=[1.6,0.8]，head₂=[0.2,1.1]（示意）' },
            { title: 'Concat 只是拼接', body: '把两个二维结果首尾接起来，形成四维向量，不是相加。', example: '[1.6,0.8] ⊕ [0.2,1.1] = [1.6,0.8,0.2,1.1]' },
            { title: '输出投影 W_O', body: '拼接后的向量再乘一个可学习矩阵 W_O，融合不同头的信息并恢复 d_model 的维度。', example: '(1×4)(4×4) = 1×4' }
        ], insight: '多头增加的是并行“关系视角”，不是把一句话复制成多个 Token。',
        caution: '这里的二维头仅用于可视化；真实模型的头数和维度由架构配置决定。'
    },
    {
        id: 'normalization', no: '06', eyebrow: '编码器构件', title: 'Add & Norm 为什么不能省', en: 'Residual Connection & LayerNorm',
        summary: '残差连接把子层输入直接加回输出；LayerNorm 则对每个 Token 的特征维度做数值标准化，并允许可学习的缩放与偏移。',
        question: '为什么输出要再加上原始输入，并对数值归一化？', formula: String.raw `Y=\operatorname{LN}(X+F(X)),\quad \operatorname{LN}(r)=\gamma\odot\frac{r-\mu}{\sqrt{\sigma^2+\varepsilon}}+\beta`,
        input: 'X=[1,2,3,4]，F(X)=[0.1,-0.2,0.3,0]', output: 'R=[1.1,1.8,3.3,4]', duration: '12 min',
        steps: [
            { title: '先 Add：走一条捷径', body: 'Residual = X + F(X)。即使子层输出接近 0，输入仍可以通过这条捷径继续传递，并为反向传播提供更直接的梯度路径。', example: '[1,2,3,4] + [0.1,-0.2,0.3,0] → [1.1,1.8,3.3,4]' },
            { title: '计算该 Token 的均值', body: '把同一个 Token 的四个特征相加后除以 4。不是把句子中所有 Token 混在一起算。', example: 'μ=(1.1+1.8+3.3+4)/4=2.55' },
            { title: '计算方差，再标准化', body: '每个数减均值、平方求平均得到方差，再除以 √(方差+ε)，避免数值尺度漂移。', example: 'σ²=1.3325；标准化 ≈ [-1.256,-0.650,0.650,1.256]' },
            { title: '最后乘 γ，加 β', body: 'γ、β 是逐维可学习参数，允许模型重新调整标准化后的尺度和偏移。', example: 'Y = γ ⊙ 标准化向量 + β' }
        ], insight: '原始 Transformer 使用 Post-LN：先 Add，再 Norm。现代一些模型则使用 Pre-LN。',
        caution: '在 LN 的 γ、β 不等于 1 和 0 时，最终输出不一定仍然均值为 0、方差为 1。'
    },
    {
        id: 'ffn', no: '07', eyebrow: '编码器构件', title: 'FFN：每个 Token 的独立加工厂', en: 'Position-wise Feed-Forward Network',
        summary: 'FFN 对每个 Token 使用同一套参数独立计算，先升维、经过非线性激活，再降回原维度。它不在不同 Token 之间直接交换信息。',
        question: '为什么要把 4 维先变成 8 维，再变回 4 维？', formula: String.raw `\operatorname{FFN}(x)=\operatorname{ReLU}(xW_1+b_1)W_2+b_2`,
        input: '一个 Token 的 4 维向量', output: '新的 4 维向量', duration: '11 min',
        steps: [
            { title: '第一层：4→8', body: '输入一行四个数，与 4×8 的 W₁ 相乘，再加八维偏置 b₁。得到一个 Token 的八个中间特征。', example: '(1×4)(4×8) = 1×8' },
            { title: 'ReLU：负数变为零', body: '对八个数分别执行 max(0,x)。例如 -0.7→0，1.2→1.2。非线性让两层不能简单合并成一次矩阵乘法。', example: 'ReLU([-1,0.5,2]) = [0,0.5,2]' },
            { title: '第二层：8→4', body: '八维特征乘 8×4 的 W₂，加四维偏置 b₂，输出四维向量。', example: '(1×8)(8×4)=1×4' },
            { title: '各个 Token 各算各的', body: '每个 Token 都使用同一组 W₁、b₁、W₂、b₂，但输入不同，输出通常不同。', example: 'FFN(我)、FFN(爱)、FFN(你) 共享权重，不互相做点积。' }
        ], insight: 'Attention 让 Token 之间汇聚信息；FFN 在单个位置上进行非线性特征变换。',
        caution: '8 只是教学用扩展宽度；真实 Transformer 的 d_ff 往往比 d_model 大得多。'
    },
    {
        id: 'mask', no: '08', eyebrow: '解码器构件', title: 'Mask：让模型不能偷看答案', en: 'Causal Mask & Padding Mask',
        summary: 'Mask 不删除 Token，而是在 Softmax 之前禁止一些 Q-K 匹配，使不允许关注的位置最终获得零注意力权重。',
        question: '为什么当前位置看不到“未来”的 Token？', formula: String.raw `A=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}+M\right),\quad M_{ij}=\begin{cases}0&j\le i\\-\infty&j>i\end{cases}`,
        input: '评分 [1,2,3,4]，当前 Query 位置=2', output: 'Mask 后 [1,2,3,-∞]', duration: '10 min',
        steps: [
            { title: 'Causal Mask 规定可见范围', body: '目标位置 i 只允许关注 j≤i 的位置。右上角未来位置被遮挡；这是自回归 Decoder Self-Attention 的关键。', example: '当前 i=2 → 可以看 0、1、2；不能看 3。' },
            { title: '在 Softmax 之前加 Mask', body: '允许关注加 0，不变；禁止关注加 -∞，对应指数变成 0。', example: '[1,2,3,4]+[0,0,0,-∞]=[1,2,3,-∞]' },
            { title: 'Softmax 给被遮挡位置 0 权重', body: 'e^(-∞)=0，因此该位置不参与 Value 的加权求和。', example: 'Softmax([1,2,3,-∞])≈[0.0900,0.2447,0.6652,0]' },
            { title: 'Padding Mask 遮掉补齐位置', body: '不同长度的句子补齐为相同张量时，<pad> 不属于实际文本。Padding Mask 通常将这些 Key 列标为不可见。', example: '[我, 爱, <pad>] → 第 3 列不可关注' }
        ], insight: 'Causal Mask 防止读取未来目标信息；Padding Mask 防止填充 Key 参与注意力。两者可以组合。',
        caution: '如果一整行都被标成 -∞，普通 Softmax 将出现数值问题；实际实现要保证或特殊处理有效位置。'
    },
    {
        id: 'encoder', no: '09', eyebrow: '经典主架构', title: 'Encoder：完整读懂输入句子', en: 'Transformer Encoder',
        summary: 'Encoder 使用无因果限制的 Self-Attention 汇聚源侧信息，再通过 Add & Norm、FFN、Add & Norm 得到每个源位置的上下文表示。',
        question: '一层 Encoder 内部到底走过哪些步骤？', formula: String.raw `U=\operatorname{LN}(X+\operatorname{MHA}(X)),\quad H=\operatorname{LN}(U+\operatorname{FFN}(U))`,
        input: '源句的 n×d_model 向量', output: 'H_enc，形状仍为 n×d_model', duration: '10 min',
        steps: [
            { title: 'Embedding + 位置编码', body: 'n 个源 Token 各取一个 d_model 维向量，并加入位置表示，形成输入矩阵 X。', example: '「我 爱 你」→ X 的形状为 3×4' },
            { title: 'Self-Attention 汇聚其他词', body: '同一组 X 产生 Q、K、V。每个源 Query 可读取所有有效源位置，没有自回归的“禁止未来”限制。', example: '3 个源位置 → 3×3 注意力矩阵' },
            { title: '第一次 Add & Norm', body: 'MHA 的输出加上进入 MHA 之前的 X，然后逐 Token 做 LayerNorm。', example: 'U=LN(X+MHA(X))' },
            { title: 'FFN 与第二次 Add & Norm', body: '各 Token 独立做非线性变换，再加回 U 并做归一化。', example: 'H_enc=LN(U+FFN(U))' }
        ], insight: 'Encoder 的最终每一行仍对应一个输入 Token 位置，但已经融合了整句上下文。',
        caution: '经典模型可以堆叠多层 Encoder；本教程的单层流程只是在解释其中一层。'
    },
    {
        id: 'decoder', no: '10', eyebrow: '经典主架构', title: 'Decoder：一边看前缀，一边查询源句', en: 'Transformer Decoder & Cross-Attention',
        summary: '经典 Decoder 先 Masked Self-Attention，再使用 Cross-Attention 读取 Encoder 输出，最后 FFN；三个子层之后都接 Add & Norm。',
        question: 'Cross-Attention 的 Q、K、V 为什么来自不同地方？', formula: String.raw `Q=UW_Q,\quad K=H_{enc}W_K,\quad V=H_{enc}W_V`,
        input: '目标前缀 Y 与源句表示 H_enc', output: '每个目标位置的新隐藏向量 H_dec', duration: '13 min',
        steps: [
            { title: 'Masked Self-Attention：只看目标前缀', body: '目标侧 Y 产生 Q、K、V；Causal Mask 限制只能读取当前与之前目标位置。结束后做 Add & Norm，得到 U。', example: '<bos> I love you：第 1 行不能看到后面的 love。' },
            { title: 'Cross-Attention：目标 Q 查询源 K/V', body: 'Q 来自目标 U，K 和 V 来自 Encoder 的 H_enc。目标 Query 可以读取所有有效源位置。', example: '4 个目标位置 × 3 个源位置 → 4×3 匹配矩阵。' },
            { title: '第二次 Add & Norm', body: '把 Cross-Attention 的输出加回它自己的输入 U，再做 LayerNorm，得到 C。', example: 'C=LN(U+CrossMHA(U,H_enc))' },
            { title: 'FFN + 第三次 Add & Norm', body: '对每个目标位置独立加工，并把 FFN 输入 C 加回去。最后得到 H_dec。', example: 'H_dec=LN(C+FFN(C))' }
        ], insight: 'Self-Attention 读目标前缀；Cross-Attention 读源句。经典 Encoder–Decoder 的关键差异就在这里。',
        caution: 'Decoder 输出的是隐藏向量，不是直接生成的单词。下一步还需要词表投影。'
    },
    {
        id: 'training', no: '11', eyebrow: '从预测到学习', title: 'Training：模型怎样知道自己错了', en: 'Logits · Teacher Forcing · Cross-Entropy',
        summary: '训练时用正确目标前缀构造 Decoder 输入，再将隐藏状态投影成词表评分，经 Softmax 得到概率；用交叉熵衡量错误，利用梯度反向更新参数。',
        question: '正确答案的预测概率为什么决定了 Loss？', formula: String.raw `\ell=-\log p_{\mathrm{correct}},\qquad \frac{\partial\ell}{\partial z_j}=p_j-\mathbf1[j=y]`,
        input: 'Decoder 输出 + 正确目标 Token', output: 'Loss 与模型参数梯度', duration: '14 min',
        steps: [
            { title: 'Teacher Forcing：准备正确历史', body: '训练时已知目标句，把 <bos> I love you 作为 Decoder 输入，把 I love you <eos> 作为标签，二者错开一位。', example: '输入 <bos> I → 正确预测 love' },
            { title: 'Logits → Softmax', body: '隐藏向量乘词表投影矩阵 W_vocab，得到各候选 Token 原始分数；Softmax 转成概率。', example: '[1,2,3] → [0.0900,0.2447,0.6652]' },
            { title: 'Cross-Entropy：只看正确答案的概率', body: '单个位置的负对数似然是 -ln P(正确 Token)。正确概率越高，Loss 越小。', example: 'p_correct=0.7 → Loss≈0.3567' },
            { title: '反向传播与梯度下降', body: '先计算每个 Logit 的梯度 p−onehot(y)，再通过链式法则传回权重，优化器更新可学习参数。', example: 'θ_new=θ_old−学习率×梯度' }
        ], insight: 'Teacher Forcing 使用正确的历史 Token；推理则使用模型刚刚生成的 Token。两者不能混为一谈。',
        caution: '本教程是教学用确定性算例，不会真正训练神经网络权重。'
    },
    {
        id: 'generation', no: '12', eyebrow: '从预测到学习', title: 'Generation：一个 Token 接着一个', en: 'Autoregressive Inference',
        summary: '生成时 Encoder 先处理一次源句；Decoder 每轮读取当前前缀，只使用最后一个目标位置的概率选择下一个 Token，再追加，直到遇到停止条件。',
        question: '为什么生成整句话必须循环很多轮？', formula: String.raw `y_t=\arg\max_v P(v\mid y_{<t},x),\qquad prefix\leftarrow[prefix,y_t]`,
        input: '源句 + <bos>', output: 'I love you <eos>（理想演示）', duration: '11 min',
        steps: [
            { title: 'Encoder 先编码源句一次', body: '输入源句在这次翻译中不变，因此 H_enc 可以复用。Decoder 的目标前缀初始化为 [<bos>]。', example: 'prefix=[2]' },
            { title: '读取最后一行概率', body: '如果当前前缀有 t 个 Token，Decoder 输出 t 行隐藏向量和 t 行词表概率。只有最后一行用于预测下一个位置。', example: '<bos> I → 读取第 1 行概率预测 love' },
            { title: '选出 Token 并追加', body: 'Greedy Decoding 选择概率最大的 Token（argmax），将新 ID 加入 prefix，再进入下一轮。', example: '[<bos>] → [<bos>, I] → [<bos>, I, love]' },
            { title: '满足停止条件', body: '生成 <eos> 或达到预设最大长度就停止。生产模型可使用 KV Cache 优化反复计算，这里用完整前缀解释算法。', example: '<bos> I love you <eos> → 结束' }
        ], insight: '训练可以并行预测已知目标序列的位置；生成时未来 Token 未知，需要一步步决定。',
        caution: '理想输出仅用于说明流程。固定示例概率不能代表实际训练好的语言模型。'
    },
    {
        id: 'glossary', no: '13', eyebrow: '随手速查', title: 'Transformer 公式与术语速查', en: 'Symbols & Mental Models',
        summary: '把容易混淆的词、矩阵形状和核心公式集中放在一页。迷路时回到这里，明确每个字母是从哪里来的。',
        question: 'Q、K、V、Logits、Loss 等概念怎样快速区分？', formula: String.raw `\text{Token}\to\text{Embedding}\to\text{Attention}\to\text{FFN}\to\text{Logits}`,
        input: '一道陌生公式', output: '明确符号、形状与用途', duration: '5 min',
        steps: [
            { title: 'Token / ID / Embedding', body: 'Token 是文本基本单元，ID 是词表索引，Embedding 是按这个索引查到的可训练向量。', example: '「喜欢」→25→[0.5,0.1,0.2,0.3]' },
            { title: 'Q / K / V', body: 'Q 用来查询，K 用来匹配，V 承载供汇聚的数值。QKᵀ 用来生成评分，不是直接输出 Token。', example: 'Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V' },
            { title: 'Residual / Norm / FFN', body: 'Residual 是加回原输入；LayerNorm 是逐 Token 特征归一化；FFN 是逐 Token 非线性特征处理。', example: 'LN(x+F(x))，FFN(x)=ReLU(xW₁+b₁)W₂+b₂' },
            { title: 'Logits / Probability / Loss', body: 'Logits 是未经归一化的评分；Softmax 得到概率；Loss 衡量正确答案的概率不足。', example: '−ln(0.9)=0.105；−ln(0.1)=2.303' }
        ], insight: '优先追踪“这个矩阵从哪个模块来、形状是什么、下一步拿它做什么”，比死记公式更可靠。',
        caution: '本页是经典 Encoder–Decoder Transformer 的速查，不覆盖全部现代 LLM 架构变体。'
    }
];
const GLOSSARY = [
    ['Token', 'Tokenizer 输出的文本基本单元；可以是词、子词、字符或字节。'],
    ['Token ID', '某个 Token 在固定词表里的整数索引。'],
    ['Embedding', '每个 Token ID 对应的一行可学习向量。'],
    ['d_model', 'Transformer 隐藏向量的宽度。'],
    ['Position Encoding', '向输入向量提供 Token 位置信息的编码。'],
    ['Q / Query', '用来向各个 Key 发起匹配的查询向量。'],
    ['K / Key', '与 Query 做点积，计算匹配评分的键向量。'],
    ['V / Value', '根据注意力权重被加权汇聚的值向量。'],
    ['Softmax', '把任意实数评分转换为非负、总和为 1 的权重。'],
    ['Multi-Head', '多组独立投影的注意力头，输出拼接后再映射。'],
    ['Residual', '把子层原始输入绕路加回子层输出。'],
    ['LayerNorm', '对每个 Token 的特征维度计算均值、方差并归一化。'],
    ['FFN', '在每个 Token 位置独立运行的前馈网络。'],
    ['Causal Mask', '在自回归 Self-Attention 中屏蔽未来 Key。'],
    ['Padding Mask', '让补齐长度的 <pad> Key 不参与注意力。'],
    ['Cross-Attention', '目标侧提供 Q，源侧 Encoder 输出提供 K、V。'],
    ['Logits', '词表投影后的原始预测评分，不是概率。'],
    ['Teacher Forcing', '训练时使用正确历史 Token，而非模型预测历史。'],
    ['Cross-Entropy', '监督正确 Token 概率的负对数损失。'],
    ['Autoregressive', '每轮预测一个 Token 并将它加入下一轮输入的生成方式。']
];
const React = window.React;
const ReactDOM = window.ReactDOM;
const H = React.createElement;
const ic = {
    layers: React.createElement("g", null,
        React.createElement("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
        React.createElement("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
        React.createElement("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
        React.createElement("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" })),
    play: React.createElement("polygon", { points: "8 5 19 12 8 19 8 5" }), pause: React.createElement("g", null,
        React.createElement("rect", { x: "6", y: "4", width: "4", height: "16" }),
        React.createElement("rect", { x: "14", y: "4", width: "4", height: "16" })),
    arrow: React.createElement("g", null,
        React.createElement("path", { d: "M5 12h14" }),
        React.createElement("path", { d: "m13 6 6 6-6 6" })), chevron: React.createElement("path", { d: "m9 18 6-6-6-6" }), back: React.createElement("path", { d: "m15 18-6-6 6-6" }),
    book: React.createElement("g", null,
        React.createElement("path", { d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20" }),
        React.createElement("path", { d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" })),
    check: React.createElement("path", { d: "m5 12 4 4L19 6" }), home: React.createElement("g", null,
        React.createElement("path", { d: "m3 10 9-7 9 7" }),
        React.createElement("path", { d: "M5 9v12h14V9" })),
    sun: React.createElement("g", null,
        React.createElement("circle", { cx: "12", cy: "12", r: "4" }),
        React.createElement("path", { d: "M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" })),
    moon: React.createElement("path", { d: "M20.7 13.1A9 9 0 0 1 10.9 3.3 9 9 0 1 0 20.7 13.1Z" }),
    search: React.createElement("g", null,
        React.createElement("circle", { cx: "11", cy: "11", r: "7" }),
        React.createElement("path", { d: "m16 16 5 5" })),
    refresh: React.createElement("g", null,
        React.createElement("path", { d: "M20 7v5h-5" }),
        React.createElement("path", { d: "M4 17v-5h5" }),
        React.createElement("path", { d: "M5.5 9A7 7 0 0 1 18 6l2 1M4 17l2 1a7 7 0 0 0 12.5-3" })),
    clock: React.createElement("g", null,
        React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
        React.createElement("path", { d: "M12 7v5l3 2" })),
    spark: React.createElement("g", null,
        React.createElement("path", { d: "m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9L12 3Z" })),
    github: React.createElement("g", null,
        React.createElement("path", { d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-1-2.6c3.3-.4 6.7-1.6 6.7-7.4A5.8 5.8 0 0 0 20 4.1 5.4 5.4 0 0 0 19.9 0S18.6-.4 16 1.5a13.8 13.8 0 0 0-8 0C5.4-.4 4.1 0 4.1 0A5.4 5.4 0 0 0 4 4.1a5.8 5.8 0 0 0-1.7 4.1c0 5.8 3.4 7 6.7 7.4a3.4 3.4 0 0 0-1 2.6V22", transform: "translate(1 1) scale(.9)" })),
    info: React.createElement("g", null,
        React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
        React.createElement("path", { d: "M12 11v6m0-10h.01" })),
    target: React.createElement("g", null,
        React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
        React.createElement("circle", { cx: "12", cy: "12", r: "5" }),
        React.createElement("circle", { cx: "12", cy: "12", r: "1" })),
    zap: React.createElement("path", { d: "m13 2-9 12h7l-1 8 10-12h-7l0-8Z" }),
    menu: React.createElement("g", null,
        React.createElement("path", { d: "M4 6h16M4 12h16M4 18h16" })),
    close: React.createElement("path", { d: "M18 6 6 18M6 6l12 12" }),
    code: React.createElement("g", null,
        React.createElement("path", { d: "m8 8-4 4 4 4m8-8 4 4-4 4m-2-15-4 18" })),
    arrowup: React.createElement("path", { d: "m5 14 7-7 7 7" }),
    copy: React.createElement("g", null,
        React.createElement("rect", { x: "8", y: "8", width: "13", height: "13", rx: "2" }),
        React.createElement("path", { d: "M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" }))
};
function Icon({ name, size = 18, className = '' }) { return React.createElement("svg", { className: className, width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round" }, ic[name] || ic.spark); }
function f(v, places = 4) { return Number(v.toFixed(places)).toString(); }
function softmax(a) { const m = Math.max(...a), ex = a.map(v => Math.exp(v - m)), sum = ex.reduce((p, c) => p + c, 0); return ex.map(x => x / sum); }
function dot(a, b) { return a.reduce((s, v, i) => s + v * b[i], 0); }
function ColorBar({ value, max = 1, tone = 'mint', caption = '' }) { return React.createElement("div", { className: "bar-unit" },
    React.createElement("div", { className: "bar-shell" },
        React.createElement("div", { className: 'bar-ink ' + tone, style: { width: (Math.min(1, Math.max(0, value / max)) * 100) + '%' } })),
    caption && React.createElement("span", { className: "bar-caption" }, caption)); }
function Matrix({ values, highlights = [], labels = [] }) { return React.createElement("div", { className: "matrix-wrap" },
    React.createElement("div", { className: "matrix-bracket left" }),
    React.createElement("div", { className: "matrix-lines" }, values.map((line, r) => React.createElement("div", { className: "matrix-row", key: r }, line.map((val, c) => React.createElement("span", { key: c, className: 'matrix-cell ' + (highlights.some((p) => p[0] === r && p[1] === c) ? 'matrix-hi' : ''), title: labels[r] || '' }, typeof val === 'number' ? f(val, 3) : val))))),
    React.createElement("div", { className: "matrix-bracket right" })); }
class MathBlock extends React.Component {
    constructor() {
        super(...arguments);
        this.el = null;
        this.stamp = 0;
    }
    componentDidMount() { this.write(); }
    componentDidUpdate(prev) { if (prev.tex !== this.props.tex)
        this.write(); }
    write() {
        const tex = this.props.tex, el = this.el;
        if (!el)
            return;
        const mark = ++this.stamp;
        el.textContent = tex;
        const mj = window.MathJax;
        if (mj && mj.startup && mj.startup.promise) {
            mj.startup.promise.then(() => { if (mark !== this.stamp || !this.el)
                return; try {
                const svg = mj.tex2svg(tex, { display: true });
                this.el.replaceChildren(svg);
            }
            catch (err) {
                this.el.textContent = tex;
            } }).catch(() => { });
        }
    }
    render() { return React.createElement("div", { className: 'math-block ' + (this.props.small ? 'small-math' : ''), ref: (el) => this.el = el, "aria-label": this.props.tex }); }
}
const VIZ_TOKENS = [['我', 10], ['喜欢', 25], ['编程', 38], ['爱', 5], ['你', 6], ['I', 7], ['love', 8], ['you', 9], ['play', 41], ['er', 42], ['s', 43], [' ', 44]];
const EMBED_ROWS = [{ token: '我', id: 10, v: [.1, .2, .3, .4] }, { token: '喜欢', id: 25, v: [.5, .1, .2, .3] }, { token: '编程', id: 38, v: [.2, .4, .1, .5] }, { token: '爱', id: 5, v: [.3, .6, .2, .7] }, { token: '你', id: 6, v: [.4, .2, .5, .1] }];
const BASE_K = [[1, 0], [0, 1], [1, 1]];
const BASE_V = [[1, 0], [0, 2], [3, 1]];
const W1 = [[.5, -.2, .1, .3, .4, 0, .2, -.1], [0, .4, -.3, .1, .2, .5, -.1, .1], [.2, .1, .2, -.4, .1, -.3, .2, .2], [0, -.4, .2, -.3, 0, .1, .4, -.2]];
const B1 = [0, -.1, 0, -.2, .1, -.2, 0, -.1];
const W2 = [[.3, -.2, .1, .4], [.2, .1, -.1, .3], [-.1, .4, .2, -.2], [.5, .1, -.4, .2], [.1, -.3, .2, .1], [-.2, .2, .4, -.1], [.4, .2, -.3, .2], [.3, -.1, .1, -.4]];
const B2 = [.1, -.1, 0, .05];
const BASE_INPUT = [1, 0, -1, 2];
const FFNU = Array.from({ length: 8 }, (_, c) => B1[c] + BASE_INPUT.reduce((sum, x, r) => sum + x * W1[r][c], 0));
const FFNR = FFNU.map(x => Math.max(0, x));
const FFNO = Array.from({ length: 4 }, (_, c) => B2[c] + FFNR.reduce((sum, x, r) => sum + x * W2[r][c], 0));
function LabHeader({ name, description, badge }) { return React.createElement("div", { className: "lab-head" },
    React.createElement("div", null,
        React.createElement("span", { className: "lab-eyebrow" },
            React.createElement("span", { className: "signal-dot" }),
            " INTERACTIVE SANDBOX"),
        React.createElement("h3", null, name),
        React.createElement("p", null, description)),
    React.createElement("span", { className: "lab-label" }, badge || '实时计算')); }
function MiniStepTabs({ labels, active, onSelect }) { return React.createElement("div", { className: "mini-step-tabs" }, labels.map((s, i) => React.createElement("button", { key: s, onClick: () => onSelect(i), className: i === active ? 'selected' : '' },
    React.createElement("span", null, String(i + 1).padStart(2, '0')),
    s))); }
function HorizontalTokens({ items, selected = -1 }) { return React.createElement("div", { className: "token-row" }, items.map((v, i) => React.createElement("div", { key: i, className: 'token-pill ' + (selected === i ? 'active' : '') },
    React.createElement("span", null, v),
    React.createElement("small", null, i)))); }
function WaveChart({ position, dim }) {
    const W = 600, H = 172, L = 30, B = 136, scale = 130, max = 18;
    const wave = (div, fn) => Array.from({ length: 241 }, (_, i) => { const p = i / 240 * max, x = L + p / max * 550, y = 77 - fn(p / div) * 54; return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ');
    return React.createElement("svg", { className: "wave-chart", viewBox: `0 0 ${W} ${H}`, "aria-label": "\u6B63\u5F26\u4E0E\u4F59\u5F26\u4F4D\u7F6E\u7F16\u7801\u66F2\u7EBF" },
        [0, 1, 2, 3].map(i => React.createElement("line", { key: i, x1: L, y1: 25 + i * 35, x2: "590", y2: 25 + i * 35, stroke: "currentColor", opacity: ".09", strokeDasharray: "4 6" })),
        React.createElement("line", { x1: L, y1: "136", x2: "590", y2: "136", stroke: "currentColor", opacity: ".18" }),
        React.createElement("path", { d: wave(1, Math.sin), stroke: "#49d6bc", strokeWidth: "2.5", fill: "none" }),
        React.createElement("path", { d: wave(dim === 4 ? 100 : 10, Math.sin), stroke: "#b08cfa", strokeWidth: "2.5", fill: "none" }),
        React.createElement("line", { x1: L + position / max * 550, y1: "16", x2: L + position / max * 550, y2: "142", stroke: "white", strokeDasharray: "4 4", opacity: ".6" }),
        React.createElement("circle", { cx: L + position / max * 550, cy: 77 - Math.sin(position) * 54, r: "5", fill: "#49d6bc", stroke: "#09111d", strokeWidth: "2" }),
        React.createElement("circle", { cx: L + position / max * 550, cy: 77 - Math.sin(position / (dim === 4 ? 100 : 10)) * 54, r: "5", fill: "#b08cfa", stroke: "#09111d", strokeWidth: "2" }),
        [0, 6, 12, 18].map(p => React.createElement("text", { key: p, x: L + p / max * 550, y: "158", fill: "currentColor", opacity: ".55", fontSize: "11", textAnchor: "middle" }, p)));
}
function AttentionNetwork({ weights, selected }) {
    return React.createElement("div", { className: "attention-network" },
        React.createElement("svg", { viewBox: "0 0 590 190", className: "connection-svg" },
            React.createElement("g", null,
                weights.map((w, i) => React.createElement("g", { key: i },
                    React.createElement("line", { x1: "136", y1: "95", x2: "445", y2: 40 + i * 55, stroke: selected === i ? '#55dfc3' : '#759ebc', strokeWidth: 1 + w * 8, strokeOpacity: selected === i ? 1 : .42, strokeLinecap: "round", className: "attention-path" }),
                    React.createElement("circle", { cx: "445", cy: 40 + i * 55, r: "4", fill: "#65dbcc" }))),
                React.createElement("rect", { x: "20", y: "68", width: "112", height: "56", rx: "12", fill: "#173c40", stroke: "#397c73" }),
                React.createElement("text", { x: "76", y: "90", textAnchor: "middle", fill: "white", fontSize: "14", fontWeight: "600" }, "Query"),
                React.createElement("text", { x: "76", y: "109", textAnchor: "middle", fill: "#a0ddd6", fontSize: "12" }, "\u5F53\u524D Token"),
                weights.map((w, i) => React.createElement("g", { key: i },
                    React.createElement("rect", { x: "448", y: 18 + i * 55, width: "126", height: "46", rx: "9", fill: selected === i ? '#284353' : '#192334', stroke: selected === i ? '#5ad3bd' : '#43516a' }),
                    React.createElement("text", { x: "465", y: 39 + i * 55, fill: "white", fontSize: "13" },
                        "Key ",
                        i + 1),
                    React.createElement("text", { x: "465", y: 54 + i * 55, fill: "#a5b5c7", fontSize: "11" },
                        (w * 100).toFixed(1),
                        "% \u6743\u91CD"))))),
        React.createElement("p", null, "\u8FDE\u7EBF\u7C97\u7EC6 = \u5F53\u524D Query \u5BF9\u4E0D\u540C Key \u7684\u6CE8\u610F\u529B\u6743\u91CD"));
}
function Architecture({ go }) {
    return React.createElement("div", { className: "architecture-layout" },
        React.createElement("div", { className: "architecture-column" },
            React.createElement("span", { className: "arch-heading" }, "SOURCE \u00B7 \u6E90\u4FA7"),
            React.createElement("button", { onClick: () => go('tokenizer'), className: "arch-node" },
                "\u6587\u5B57 / Token IDs",
                React.createElement("small", null, "Tokenizer + Embedding")),
            React.createElement("div", { className: "arch-down" }, "\u2193"),
            React.createElement("button", { onClick: () => go('position'), className: "arch-node" },
                "\u4F4D\u7F6E\u7F16\u7801",
                React.createElement("small", null, "Embedding + PE")),
            React.createElement("div", { className: "arch-down" }, "\u2193"),
            React.createElement("button", { onClick: () => go('encoder'), className: "arch-node highlighted blue" },
                "Encoder",
                React.createElement("small", null, "Self-Attention \u2192 FFN"))),
        React.createElement("div", { className: "architecture-middle" },
            React.createElement("svg", { viewBox: "0 0 130 180", width: "100%", height: "150" },
                React.createElement("path", { d: "M3 93 C55 93,48 30,120 30", fill: "none", stroke: "#4e7bbb", strokeWidth: "2", strokeDasharray: "7 5" }),
                React.createElement("path", { d: "M3 93 C55 93,48 151,120 151", fill: "none", stroke: "#4e7bbb", strokeWidth: "2", opacity: ".55", strokeDasharray: "7 5" }),
                React.createElement("path", { d: "m114 25 7 5-7 5", stroke: "#7db1f2", fill: "none" }),
                React.createElement("path", { d: "m114 146 7 5-7 5", stroke: "#7db1f2", fill: "none" }),
                React.createElement("text", { x: "53", y: "77", fill: "#9db2cf", fontSize: "11", textAnchor: "middle" }, "K, V"))),
        React.createElement("div", { className: "architecture-column" },
            React.createElement("span", { className: "arch-heading" }, "TARGET \u00B7 \u76EE\u6807\u4FA7"),
            React.createElement("button", { onClick: () => go('mask'), className: "arch-node" },
                "\u76EE\u6807\u524D\u7F00 + Mask",
                React.createElement("small", null, "Masked Self-Attention")),
            React.createElement("div", { className: "arch-down" }, "\u2193"),
            React.createElement("button", { onClick: () => go('decoder'), className: "arch-node highlighted purple" },
                "Decoder",
                React.createElement("small", null, "Cross-Attention \u2192 FFN")),
            React.createElement("div", { className: "arch-down" }, "\u2193"),
            React.createElement("button", { onClick: () => go('generation'), className: "arch-node" },
                "\u8BCD\u8868\u6295\u5F71 \u2192 \u751F\u6210",
                React.createElement("small", null, "Logits / Softmax"))));
}
class App extends React.Component {
    constructor(props) {
        super(props);
        this.onHash = () => { const r = this.getRoute(); this.setState({ route: r, labStage: 0, menu: false }); window.scrollTo(0, 0); };
        this.go = (id) => { location.hash = id === 'home' ? '#/' : '#/learn/' + id; if (this.getRoute() === this.state.route)
            window.scrollTo(0, 0); };
        this.set = (key, value) => { this.setState({ [key]: value }); };
        this.toggleDone = (id) => { const d = this.state.done.includes(id) ? this.state.done.filter((v) => v !== id) : [...this.state.done, id]; this.setState({ done: d }); try {
            localStorage.setItem('transformer-atlas-done', JSON.stringify(d));
        }
        catch (_) { } };
        this.toggleTheme = () => { const t = this.state.theme === 'dark' ? 'light' : 'dark'; this.setState({ theme: t }); document.documentElement.dataset.theme = t; try {
            localStorage.setItem('transformer-atlas-theme', t);
        }
        catch (_) { } };
        this.Visualization = ({ id }) => {
            const s = this.state, change = this.set;
            if (id === 'overview')
                return React.createElement("div", { className: "interactive-card" },
                    React.createElement(LabHeader, { name: "\u70B9\u51FB\u6A21\u5757\u67E5\u770B\u804C\u8D23", description: "\u8FD9\u5F20\u56FE\u4EE3\u8868\u5B8C\u6574\u7684\u7ECF\u5178 Encoder\u2013Decoder \u6570\u636E\u6D41\u3002", badge: "\u67B6\u6784\u5730\u56FE" }),
                    React.createElement(Architecture, { go: this.go }));
            if (id === 'tokenizer') {
                const input = s.tokenInput;
                const toks = [];
                let rest = input;
                while (rest.length && toks.length < 48) {
                    const m = VIZ_TOKENS.filter(t => rest.startsWith(t[0])).sort((a, b) => b[0].length - a[0].length)[0];
                    if (m) {
                        toks.push({ piece: m[0], id: m[1] });
                        rest = rest.slice(m[0].length);
                    }
                    else {
                        const c = Array.from(rest)[0];
                        toks.push({ piece: c, id: 0 });
                        rest = rest.slice(c.length);
                    }
                }
                return React.createElement("div", { className: "interactive-card" },
                    React.createElement(LabHeader, { name: "\u8FF7\u4F60\u5206\u8BCD\u5668", description: "\u8F93\u5165\u4E00\u53E5\u8BDD\uFF0C\u89C2\u5BDF\u6559\u5B66\u8BCD\u8868\u7684\u6700\u957F\u5339\u914D\u5207\u5206\u548C ID \u67E5\u627E\u3002", badge: "\u53EF\u7F16\u8F91\u8F93\u5165" }),
                    React.createElement("label", { className: "control-label" }, "\u8F93\u5165\u6587\u672C"),
                    React.createElement("input", { className: "wide-input", value: s.tokenInput, onChange: (e) => change('tokenInput', e.target.value), maxLength: 60 }),
                    React.createElement("div", { className: "preset-row" }, ['我喜欢编程', '我爱你', 'players', 'I love you'].map(t => React.createElement("button", { key: t, onClick: () => change('tokenInput', t) }, t))),
                    React.createElement("div", { className: "flow-arrow" },
                        React.createElement(Icon, { name: "arrow", size: 18 }),
                        " TOKENIZE"),
                    React.createElement("div", { className: "token-result" }, toks.map((t, i) => React.createElement("div", { className: 'token-result-item ' + (t.id === 0 ? 'unknown' : ''), key: i },
                        React.createElement("strong", null, t.piece === ' ' ? '␣' : t.piece),
                        React.createElement("span", null,
                            "ID ",
                            t.id === 0 ? 'UNK' : t.id)))),
                    React.createElement("div", { className: "calc-footer" },
                        React.createElement("span", null,
                            "Token \u6570\u91CF\uFF1A",
                            React.createElement("strong", null, toks.length)),
                        React.createElement("span", null,
                            "Token IDs\uFF1A",
                            React.createElement("code", null,
                                "[",
                                toks.map(t => t.id).join(', '),
                                "]"))),
                    React.createElement("p", { className: "lab-hint" }, "\u672C\u5B9E\u9A8C\u523B\u610F\u4F7F\u7528\u5C0F\u8BCD\u8868\uFF1B\u771F\u5B9E Byte-level BPE \u4E0D\u4F1A\u56E0\u4E3A\u964C\u751F\u5355\u8BCD\u5C31\u7B80\u5355\u5730\u8F93\u51FA\u5355\u4E2A <unk>\u3002"));
            }
            if (id === 'embedding') {
                const selected = EMBED_ROWS.find(row => row.id === s.embeddingPick) || EMBED_ROWS[0];
                return React.createElement("div", { className: "interactive-card" },
                    React.createElement(LabHeader, { name: "\u7528 Token ID \u67E5\u8868", description: "\u70B9\u51FB\u8BCD\u8868\u4E2D\u7684\u4EFB\u610F\u4E00\u884C\uFF0C\u89C2\u5BDF E[id] \u5982\u4F55\u76F4\u63A5\u53D6\u51FA Embedding \u5411\u91CF\u3002" }),
                    React.createElement("div", { className: "embedding-lab" },
                        React.createElement("div", { className: "embed-table" },
                            React.createElement("div", { className: "embed-header" },
                                React.createElement("span", null, "ID"),
                                React.createElement("span", null, "TOKEN"),
                                React.createElement("span", null, "VECTOR (4D)")),
                            EMBED_ROWS.map(row => React.createElement("button", { className: 'embed-row ' + (selected.id === row.id ? 'selected' : ''), onClick: () => change('embeddingPick', row.id), key: row.id },
                                React.createElement("span", null, row.id),
                                React.createElement("strong", null, row.token),
                                React.createElement("code", null,
                                    "[",
                                    row.v.join(', '),
                                    "]")))),
                        React.createElement("div", { className: "embed-output" },
                            React.createElement("span", { className: "embed-scan" },
                                "LOOKUP \u2192 E[",
                                selected.id,
                                "]"),
                            React.createElement("div", { className: "embed-big" }, selected.v.map((v, i) => React.createElement("div", { key: i },
                                React.createElement("small", null,
                                    "dim ",
                                    i),
                                React.createElement("strong", null, v.toFixed(1))))),
                            React.createElement("p", null,
                                "Token\u300C",
                                selected.token,
                                "\u300D\u6309 ID ",
                                React.createElement("strong", null, selected.id),
                                " \u53D6\u5230\u4E86\u8FD9\u56DB\u4E2A\u53C2\u6570\u3002"))));
            }
            if (id === 'position') {
                const d = s.dim, position = s.position;
                const vals = Array.from({ length: d }, (_, k) => { const i = Math.floor(k / 2), arg = position / Math.pow(10000, 2 * i / d); return k % 2 ? Math.cos(arg) : Math.sin(arg); });
                return React.createElement("div", { className: "interactive-card" },
                    React.createElement(LabHeader, { name: "\u6B63\u5F26\u4F4D\u7F6E\u7F16\u7801\u5B9E\u9A8C", description: "\u62D6\u52A8 Token \u4F4D\u7F6E\uFF0C\u89C2\u5BDF\u4E0D\u540C\u9891\u7387\u7684 sin / cos \u5982\u4F55\u4E00\u8D77\u6539\u53D8\u3002" }),
                    React.createElement("div", { className: "slider-control" },
                        React.createElement("label", null,
                            "Token \u4F4D\u7F6E ",
                            React.createElement("strong", null,
                                "pos = ",
                                position)),
                        React.createElement("input", { type: "range", min: "0", max: "18", step: "1", value: position, onChange: (e) => change('position', +e.target.value) })),
                    React.createElement("div", { className: "seg-row" },
                        React.createElement("span", null, "\u7F16\u7801\u7EF4\u5EA6"),
                        [4, 8].map(v => React.createElement("button", { className: d === v ? 'active' : '', onClick: () => change('dim', v), key: v },
                            v,
                            " \u7EF4"))),
                    React.createElement("div", { className: "chart-legend" },
                        React.createElement("span", null,
                            React.createElement("i", { className: "legend-color mint" }),
                            "sin(pos)"),
                        React.createElement("span", null,
                            React.createElement("i", { className: "legend-color purple" }),
                            "sin(pos / ",
                            d === 4 ? 100 : 10,
                            ")")),
                    React.createElement(WaveChart, { position: position, dim: d }),
                    React.createElement("p", { className: "lab-smalltitle" },
                        "PE(",
                        position,
                        ") \u7684 ",
                        d,
                        " \u4E2A\u6570\u503C"),
                    React.createElement("div", { className: "vector-strip" }, vals.map((v, i) => React.createElement("div", { key: i, className: i % 2 ? 'purple' : 'mint' },
                        React.createElement("span", null,
                            i % 2 ? 'cos' : 'sin',
                            " \u00B7 d",
                            i),
                        React.createElement("strong", null, v.toFixed(4))))));
            }
            if (id === 'attention' || id === 'multihead') {
                const opts = [[1, 0], [0, 1], [1, 1]], q = opts[s.qmode] || opts[0], scores = BASE_K.map(k => dot(q, k)), scaled = scores.map(v => v / Math.sqrt(2)), weights = softmax(scaled), out = [0, 1].map(j => weights.reduce((v, w, i) => v + w * BASE_V[i][j], 0));
                if (id === 'multihead') {
                    const first = softmax(BASE_K.map(k => dot([1, 0], k) / Math.sqrt(2))), out1 = [0, 1].map(j => first.reduce((v, w, i) => v + w * BASE_V[i][j], 0)), other = softmax(BASE_K.map(k => dot([0, 1], k) / Math.sqrt(2))), out2 = [0, 1].map(j => other.reduce((v, w, i) => v + w * BASE_V[i][j], 0));
                    return React.createElement("div", { className: "interactive-card" },
                        React.createElement(LabHeader, { name: "\u4E24\u4E2A\u5934\u540C\u65F6\u770B", description: "\u540C\u4E00\u7EC4 K/V\uFF0C\u5C55\u793A\u4E24\u79CD\u4E0D\u540C\u67E5\u8BE2\u5411\u91CF\u5982\u4F55\u5F97\u5230\u4E0D\u540C\u7684\u6CE8\u610F\u529B\u5206\u5E03\u3002", badge: "\u53CC\u5934\u793A\u610F" }),
                        React.createElement("div", { className: "dual-head" },
                            React.createElement("div", { className: "head-panel" },
                                React.createElement("span", null, "HEAD 01"),
                                React.createElement("strong", null, "Q = [1, 0]"),
                                first.map((p, i) => React.createElement("div", { className: "head-bar", key: i },
                                    React.createElement("small", null,
                                        "K",
                                        i + 1),
                                    React.createElement(ColorBar, { value: p }),
                                    React.createElement("b", null,
                                        (p * 100).toFixed(1),
                                        "%"))),
                                React.createElement("p", null,
                                    "\u8F93\u51FA [",
                                    out1.map(f).join(', '),
                                    "]")),
                            React.createElement("div", { className: "head-panel" },
                                React.createElement("span", null, "HEAD 02"),
                                React.createElement("strong", null, "Q = [0, 1]"),
                                other.map((p, i) => React.createElement("div", { className: "head-bar", key: i },
                                    React.createElement("small", null,
                                        "K",
                                        i + 1),
                                    React.createElement(ColorBar, { value: p, tone: "purple" }),
                                    React.createElement("b", null,
                                        (p * 100).toFixed(1),
                                        "%"))),
                                React.createElement("p", null,
                                    "\u8F93\u51FA [",
                                    out2.map(f).join(', '),
                                    "]"))),
                        React.createElement("div", { className: "vector-operation" },
                            "CONCAT \u2192 ",
                            React.createElement("strong", null,
                                "[",
                                [...out1, ...out2].map(v => f(v, 3)).join(', '),
                                "]")),
                        React.createElement("p", { className: "lab-hint" }, "\u771F\u5B9E\u591A\u5934\u6CE8\u610F\u529B\u4F7F\u7528\u5404\u5934\u5404\u81EA\u8BAD\u7EC3\u7684 Q/K/V \u6295\u5F71\uFF1B\u8FD9\u91CC\u4EC5\u7528\u4E0D\u540C Query \u5C55\u793A\u6CE8\u610F\u529B\u5DEE\u5F02\uFF0C\u4E4B\u540E\u8FD8\u9700\u4E58 W_O\u3002"));
                }
                const stage = s.labStage % 4;
                const active = [['生成 Q/K/V', '点积并缩放', 'Softmax', 'Value 加权']];
                return React.createElement("div", { className: "interactive-card" },
                    React.createElement(LabHeader, { name: "Attention\uFF1A\u4ECE\u5206\u6570\u5230\u65B0\u5411\u91CF", description: "\u9009\u62E9 Query\uFF0C\u518D\u4F9D\u6B21\u70B9\u51FB 4 \u4E2A\u8BA1\u7B97\u9636\u6BB5\u3002\u6240\u6709\u6570\u5B57\u90FD\u4F1A\u5B9E\u65F6\u66F4\u65B0\u3002" }),
                    React.createElement("div", { className: "query-chooser" },
                        React.createElement("span", null, "\u5F53\u524D Query"),
                        opts.map((o, i) => React.createElement("button", { className: s.qmode === i ? 'active' : '', key: i, onClick: () => change('qmode', i) },
                            "[",
                            o.join(', '),
                            "]"))),
                    React.createElement(MiniStepTabs, { labels: active[0], active: stage, onSelect: (i) => change('labStage', i) }),
                    stage === 0 && React.createElement("div", { className: "lab-stage" },
                        React.createElement("div", { className: "split-variables" },
                            React.createElement("div", null,
                                React.createElement("small", null, "QUERY"),
                                React.createElement("strong", null,
                                    "[",
                                    q.join(', '),
                                    "]")),
                            React.createElement("div", null,
                                React.createElement("small", null, "KEY MATRIX"),
                                React.createElement(Matrix, { values: BASE_K })),
                            React.createElement("div", null,
                                React.createElement("small", null, "VALUE MATRIX"),
                                React.createElement(Matrix, { values: BASE_V }))),
                        React.createElement("p", { className: "lab-hint" }, "\u5B9E\u9645\u6A21\u578B\u4F7F\u7528\u8F93\u5165 X \u4E58 W_Q/W_K/W_V \u5F97\u5230\u8FD9\u4E9B\u5411\u91CF\u3002\u8FD9\u91CC\u4ECE\u7ED9\u5B9A Q/K/V \u5F00\u59CB\u624B\u7B97 Attention\u3002")),
                    stage === 1 && React.createElement("div", { className: "lab-stage" },
                        React.createElement("div", { className: "score-cards" }, BASE_K.map((k, i) => React.createElement("div", { className: "score-card", key: i },
                            React.createElement("small", null,
                                "q \u00B7 K",
                                i + 1),
                            React.createElement("strong", null, f(scores[i])),
                            React.createElement("span", null,
                                "\u00F7 \u221A2 = ",
                                f(scaled[i]))))),
                        React.createElement("div", { className: "vector-operation" },
                            "\u7F29\u653E\u5206\u6570 ",
                            React.createElement("strong", null,
                                "[",
                                scaled.map(v => f(v)).join(', '),
                                "]"))),
                    stage === 2 && React.createElement("div", { className: "lab-stage" },
                        React.createElement(AttentionNetwork, { weights: weights, selected: s.focusKey }),
                        React.createElement("div", { className: "weight-details" }, weights.map((w, i) => React.createElement("button", { className: s.focusKey === i ? 'selected' : '', key: i, onClick: () => change('focusKey', s.focusKey === i ? -1 : i) },
                            React.createElement("span", null,
                                "Key ",
                                i + 1),
                            React.createElement("strong", null,
                                (w * 100).toFixed(2),
                                "%"),
                            React.createElement(ColorBar, { value: w, max: .75, tone: i === 1 ? 'purple' : 'mint' })))),
                        React.createElement("div", { className: "vector-operation" },
                            "\u03A3 \u6CE8\u610F\u529B\u6743\u91CD = ",
                            React.createElement("strong", null, f(weights.reduce((a, b) => a + b, 0), 4)))),
                    stage === 3 && React.createElement("div", { className: "lab-stage" },
                        React.createElement("div", { className: "value-sum" }, weights.map((w, i) => React.createElement("div", { key: i },
                            React.createElement("small", null,
                                f(w, 4),
                                " \u00D7 V",
                                i + 1),
                            React.createElement("strong", null,
                                "[",
                                BASE_V[i].map(v => f(w * v, 4)).join(', '),
                                "]")))),
                        React.createElement("div", { className: "output-vector" },
                            React.createElement("span", null, "\u6700\u7EC8\u8F93\u51FA\u5411\u91CF"),
                            React.createElement("strong", null,
                                "[",
                                out.map(v => f(v, 6)).join(', '),
                                "]"))),
                    React.createElement("div", { className: "lab-controls" },
                        React.createElement("button", { className: "subtle-button", onClick: () => change('labStage', (stage + 3) % 4) },
                            React.createElement(Icon, { name: "back", size: 15 }),
                            " \u4E0A\u4E00\u6B65"),
                        React.createElement("span", null,
                            stage + 1,
                            " / 4"),
                        React.createElement("button", { className: "primary-button compact", onClick: () => change('labStage', (stage + 1) % 4) },
                            stage === 3 ? '重新查看' : '下一步',
                            " ",
                            React.createElement(Icon, { name: "arrow", size: 16 }))));
            }
            if (id === 'normalization') {
                const x = [1, 2, 3, 4], fx = [.1, -.2, .3, 0], r = x.map((v, i) => v + fx[i]);
                const mean = r.reduce((a, b) => a + b, 0) / 4, variance = r.reduce((a, v) => a + (v - mean) ** 2, 0) / 4, eps = .00001;
                const normal = r.map(v => (v - mean) / Math.sqrt(variance + eps)), adjusted = normal.map(v => v * s.normGamma);
                return React.createElement("div", { className: "interactive-card" },
                    React.createElement(LabHeader, { name: "Add \u2192 Norm \u5B9E\u65F6\u8BA1\u7B97", description: "\u4ECE\u4E00\u4E2A Token \u7684\u56DB\u7EF4\u5411\u91CF\u51FA\u53D1\uFF0C\u9010\u6B65\u770B\u5230\u5747\u503C\u3001\u65B9\u5DEE\u4E0E\u6807\u51C6\u5316\u540E\u7684\u7ED3\u679C\u3002" }),
                    React.createElement("div", { className: "operation-stack" },
                        React.createElement("div", null,
                            React.createElement("span", null, "\u8F93\u5165 X"),
                            React.createElement("strong", null,
                                "[",
                                x.join(', '),
                                "]")),
                        React.createElement("div", null,
                            React.createElement("span", null, "\u5B50\u5C42\u8F93\u51FA F(X)"),
                            React.createElement("strong", null,
                                "[",
                                fx.join(', '),
                                "]")),
                        React.createElement("div", { className: "green" },
                            React.createElement("span", null, "\u6B8B\u5DEE\u76F8\u52A0 R = X + F(X)"),
                            React.createElement("strong", null,
                                "[",
                                r.join(', '),
                                "]"))),
                    React.createElement("div", { className: "norm-metrics" },
                        React.createElement("div", null,
                            React.createElement("small", null, "\u5747\u503C \u03BC"),
                            React.createElement("strong", null, f(mean))),
                        React.createElement("div", null,
                            React.createElement("small", null, "\u65B9\u5DEE \u03C3\u00B2"),
                            React.createElement("strong", null, f(variance))),
                        React.createElement("div", null,
                            React.createElement("small", null, "\u6807\u51C6\u5DEE"),
                            React.createElement("strong", null, f(Math.sqrt(variance + eps))))),
                    React.createElement("div", { className: "slider-control" },
                        React.createElement("label", null,
                            "\u793A\u610F \u03B3\uFF08\u7EDF\u4E00\u7F29\u653E\uFF09",
                            React.createElement("strong", null, s.normGamma.toFixed(2))),
                        React.createElement("input", { type: "range", min: "0.5", max: "2", step: "0.1", value: s.normGamma, onChange: (e) => change('normGamma', +e.target.value) })),
                    React.createElement("div", { className: "vector-strip" }, adjusted.map((v, i) => React.createElement("div", { key: i, className: v < 0 ? 'orange' : 'mint' },
                        React.createElement("span", null,
                            "dim ",
                            i),
                        React.createElement("strong", null, f(v, 4))))),
                    React.createElement("p", { className: "lab-hint" }, "\u5B9E\u9A8C\u7EDF\u4E00\u8BBE\u7F6E \u03B2=0\u3001\u03B3 \u4E3A\u53EF\u8C03\u7684\u540C\u4E00\u503C\u3002\u5B9E\u9645 LayerNorm \u4F7F\u7528\u9010\u7EF4\u72EC\u7ACB\u53EF\u5B66\u4E60\u7684 \u03B3\u3001\u03B2\u3002"));
            }
            if (id === 'ffn') {
                const stage = s.labStage % 4, stages = [{ name: '输入 · 4 维', v: BASE_INPUT, descr: '一个 Token 的原始输入向量。' }, { name: '线性扩展 · 8 维', v: FFNU, descr: 'xW₁+b₁：每一列 W₁ 分别生成一个中间特征。' }, { name: 'ReLU · 8 维', v: FFNR, descr: 'max(0,u)：负数置零，非负数保留。' }, { name: '线性降维 · 4 维', v: FFNO, descr: 'RW₂+b₂：再将八个中间特征合成为四维输出。' }], a = stages[stage];
                return React.createElement("div", { className: "interactive-card" },
                    React.createElement(LabHeader, { name: "4 \u2192 8 \u2192 ReLU \u2192 4", description: "\u70B9\u51FB\u5404\u9636\u6BB5\uFF0C\u67E5\u770B\u771F\u5B9E\u77E9\u9635\u8FD0\u7B97\u540E\u6BCF\u4E00\u7EF4\u7684\u53D8\u5316\u3002" }),
                    React.createElement(MiniStepTabs, { labels: ['输入 4D', '升维 8D', 'ReLU', '降维 4D'], active: stage, onSelect: (i) => change('labStage', i) }),
                    React.createElement("div", { className: "ffn-station" },
                        React.createElement("div", { className: "ffn-grid" }, a.v.map((v, i) => React.createElement("div", { className: 'ffn-neuron ' + (v < 0 ? 'negative' : v === 0 ? 'zero' : 'positive'), key: i },
                            React.createElement("span", null,
                                "d",
                                i),
                            React.createElement("strong", null, f(v, 3)),
                            React.createElement("div", { className: "neuron-bar" },
                                React.createElement("i", { style: { height: (10 + Math.min(1, Math.abs(v) / 2) * 70) + '%' } }))))),
                        React.createElement("div", { className: "ffn-subtitle" },
                            React.createElement("span", null, a.name),
                            React.createElement("p", null, a.descr))),
                    stage === 1 && React.createElement("div", { className: "math-example" },
                        React.createElement("span", null, "\u7B2C 0 \u7EF4"),
                        React.createElement("strong", null,
                            "1\u00D70.5 + 0\u00D70 \u2212 1\u00D70.2 + 2\u00D70 + 0 = ",
                            f(FFNU[0]))),
                    stage === 2 && React.createElement("div", { className: "math-example" },
                        React.createElement("span", null, "ReLU \u89C4\u5219"),
                        React.createElement("strong", null, "ReLU(x) = max(0, x)\uFF1B\u8D1F\u503C\u5168\u90E8\u53D8\u6210 0")),
                    React.createElement("div", { className: "lab-controls" },
                        React.createElement("button", { className: "subtle-button", onClick: () => change('labStage', (stage + 3) % 4) }, "\u2190 \u4E0A\u4E00\u6B65"),
                        React.createElement("span", null,
                            stage + 1,
                            " / 4"),
                        React.createElement("button", { className: "primary-button compact", onClick: () => change('labStage', (stage + 1) % 4) },
                            "\u4E0B\u4E00\u6B65 ",
                            React.createElement(Icon, { name: "arrow", size: 15 }))));
            }
            if (id === 'mask') {
                const scores = [1, 2, 3, 4], allowed = scores.map((v, i) => !s.maskEnabled || i <= s.maskRow), logits = scores.map((v, i) => allowed[i] ? v : -Infinity), p = softmax(logits.filter(Number.isFinite)), w = [];
                let ix = 0;
                allowed.forEach(a => w.push(a ? p[ix++] : 0));
                return React.createElement("div", { className: "interactive-card" },
                    React.createElement(LabHeader, { name: "Causal Mask \u5B9E\u65F6\u5B9E\u9A8C", description: "\u9009\u62E9 Query \u6240\u5728\u884C\uFF0C\u4F53\u9A8C\u672A\u6765\u4F4D\u7F6E\u88AB\u8BBE\u7F6E\u4E3A \u2212\u221E \u540E\uFF0CSoftmax \u5982\u4F55\u5206\u914D\u6743\u91CD\u3002" }),
                    React.createElement("div", { className: "query-chooser" },
                        React.createElement("span", null, "Query \u4F4D\u7F6E"),
                        [0, 1, 2, 3].map(i => React.createElement("button", { className: s.maskRow === i ? 'active' : '', onClick: () => change('maskRow', i), key: i }, i))),
                    React.createElement("label", { className: "switch-row" },
                        React.createElement("input", { type: "checkbox", checked: s.maskEnabled, onChange: (e) => change('maskEnabled', e.target.checked) }),
                        " ",
                        React.createElement("span", null, "\u542F\u7528\u56E0\u679C\u63A9\u7801 Causal Mask")),
                    React.createElement("div", { className: "mask-matrix" },
                        React.createElement("div", { className: "mask-title" }, "QUERY \u2193 / KEY \u2192"),
                        React.createElement("div", { className: "mask-grid" }, [0, 1, 2, 3].map(i => React.createElement("div", { className: "mask-row", key: i },
                            React.createElement("span", { className: s.maskRow === i ? 'highlighted' : '' },
                                "Q",
                                i),
                            [0, 1, 2, 3].map(j => React.createElement("div", { key: j, className: s.maskEnabled && j > i ? 'blocked' : 'allowed', style: { outline: s.maskRow === i ? '1px solid rgba(104,224,201,.34)' : 'none' } }, s.maskEnabled && j > i ? '×' : '✓')))))),
                    React.createElement("div", { className: "mask-score" }, logits.map((v, i) => React.createElement("div", { key: i },
                        React.createElement("span", null,
                            "Key ",
                            i),
                        React.createElement("strong", null, Number.isFinite(v) ? v : '−∞'),
                        React.createElement(ColorBar, { value: w[i], max: 1, tone: w[i] === 0 ? 'orange' : 'mint' }),
                        React.createElement("small", null,
                            (w[i] * 100).toFixed(1),
                            "%")))),
                    React.createElement("p", { className: "lab-hint" }, "\u6B64\u5904\u8BC4\u5206\u56FA\u5B9A\u4E3A [1, 2, 3, 4]\uFF0C\u53EA\u7528\u6765\u5C55\u793A Mask \u5728 Softmax \u524D\u540E\u7684\u6548\u679C\u3002"));
            }
            if (id === 'encoder' || id === 'decoder') {
                const encoder = id === 'encoder', steps = encoder ? ['输入向量 X', 'Self-Attention', 'Add & Norm', 'FFN', 'Add & Norm / H_enc'] : ['目标向量 Y', 'Masked Self-Attention', 'Cross-Attention', 'FFN + Add & Norm', 'H_dec 输出'];
                const at = s.labStage % steps.length;
                const desc = encoder ? ['每个源 Token 都有位置编码后的向量。', '每个源 Query 可以关注全部有效源 Key。', '加回 X，再对每个 Token 做 LayerNorm。', '单独加工每个 Token，4→8→4。', '加回 FFN 的输入 U，再归一化。'] : ['目标前缀编码为四维向量。', '目标侧只能关注自己与过去的位置。', '目标侧 Q 查询源侧 Encoder 提供的 K、V。', '残差归一化后，对每个目标 Token 单独做 FFN，再 Add & Norm。', '输出隐藏状态，下一步才是词表投影。'];
                return React.createElement("div", { className: "interactive-card" },
                    React.createElement(LabHeader, { name: encoder ? 'Encoder 层逐站解析' : 'Decoder 层逐站解析', description: "\u70B9\u51FB\u6D41\u7A0B\u8282\u70B9\uFF0C\u9AD8\u4EAE\u5F53\u524D\u5B50\u5C42\u53CA\u5176\u8F93\u5165\u8F93\u51FA\u3002", badge: "\u6570\u636E\u6D41" }),
                    React.createElement("div", { className: "layer-journey" }, steps.map((step, i) => React.createElement("div", { className: "journey-item", key: i },
                        React.createElement("button", { className: 'layer-node ' + (at === i ? 'current' : '') + (i < at ? ' visited' : ''), onClick: () => change('labStage', i) },
                            React.createElement("span", { className: "layer-number" },
                                "0",
                                i + 1),
                            React.createElement("strong", null, step),
                            at === i && React.createElement("span", { className: "layer-active-signal" })),
                        i < steps.length - 1 && React.createElement("span", { className: "journey-arrow" }, "\u2193")))),
                    React.createElement("div", { className: "layer-note" },
                        React.createElement("span", null,
                            "STEP ",
                            at + 1,
                            " / ",
                            steps.length),
                        React.createElement("h4", null, steps[at]),
                        React.createElement("p", null, desc[at]),
                        !encoder && at === 2 && React.createElement("div", { className: "cross-data" },
                            React.createElement("div", null,
                                "Decoder ",
                                React.createElement("strong", null, "Q \u00B7 4\u00D72")),
                            React.createElement(Icon, { name: "arrow", size: 18 }),
                            React.createElement("div", null,
                                "Encoder ",
                                React.createElement("strong", null, "K,V \u00B7 3\u00D72")),
                            React.createElement("span", null, "\u2192 \u6CE8\u610F\u529B\u8BC4\u5206\u77E9\u9635 4\u00D73"))),
                    React.createElement("div", { className: "lab-controls" },
                        React.createElement("button", { className: "subtle-button", onClick: () => change('labStage', (at + steps.length - 1) % steps.length) }, "\u2190 \u4E0A\u4E00\u6B65"),
                        React.createElement("button", { className: "primary-button compact", onClick: () => change('labStage', (at + 1) % steps.length) },
                            "\u4E0B\u4E00\u6B65 ",
                            React.createElement(Icon, { name: "arrow", size: 15 }))));
            }
            if (id === 'training') {
                const logits = [.4 + s.trainingBias, 1.2, .8], p = softmax(logits), loss = -Math.log(p[0]), grad = p.map((v, i) => v - (i === 0 ? 1 : 0));
                return React.createElement("div", { className: "interactive-card" },
                    React.createElement(LabHeader, { name: "\u6B63\u786E\u6982\u7387\u5982\u4F55\u63A7\u5236 Loss", description: "\u5047\u8BBE\u6B63\u786E Token \u662F I\u3002\u53EA\u8C03\u6574 I \u7684 Logit\uFF0C\u89C2\u5BDF Softmax\u3001Cross-Entropy \u548C\u68AF\u5EA6\u7684\u5B9E\u65F6\u53D8\u5316\u3002" }),
                    React.createElement("div", { className: "teacher-row" },
                        React.createElement("div", null,
                            React.createElement("small", null, "DECODER \u8F93\u5165\uFF08\u6B63\u786E\u5386\u53F2\uFF09"),
                            React.createElement("strong", null, "<bos> I love")),
                        React.createElement(Icon, { name: "arrow" }),
                        React.createElement("div", null,
                            React.createElement("small", null, "\u8BAD\u7EC3\u6807\u7B7E"),
                            React.createElement("strong", null, "I love you"))),
                    React.createElement("div", { className: "slider-control" },
                        React.createElement("label", null,
                            "\u6B63\u786E Token\u300CI\u300D\u7684 Logit \u589E\u91CF ",
                            React.createElement("strong", null,
                                s.trainingBias > 0 ? '+' : '',
                                s.trainingBias.toFixed(1))),
                        React.createElement("input", { type: "range", min: "-3", max: "5", step: "0.1", value: s.trainingBias, onChange: (e) => change('trainingBias', +e.target.value) })),
                    React.createElement("div", { className: "training-probabilities" }, ['I · 正确', 'love', 'you'].map((name, i) => React.createElement("div", { className: "training-prob-row", key: i },
                        React.createElement("div", null,
                            React.createElement("span", null, name),
                            React.createElement("strong", null,
                                (p[i] * 100).toFixed(1),
                                "%")),
                        React.createElement(ColorBar, { value: p[i], tone: i === 0 ? 'mint' : 'purple' }),
                        React.createElement("small", null,
                            "logit = ",
                            f(logits[i], 2))))),
                    React.createElement("div", { className: "loss-cards" },
                        React.createElement("div", null,
                            React.createElement("span", null, "CROSS-ENTROPY LOSS"),
                            React.createElement("strong", null, f(loss, 4)),
                            React.createElement("small", null,
                                "\u2212ln(",
                                f(p[0], 4),
                                ")")),
                        React.createElement("div", null,
                            React.createElement("span", null, "\u6B63\u786E\u7C7B LOGIT GRADIENT"),
                            React.createElement("strong", null, f(grad[0], 4)),
                            React.createElement("small", null, "P(I) \u2212 1"))),
                    React.createElement("p", { className: "lab-hint" }, "\u8FD9\u662F\u4E00\u4E2A\u4E09\u5019\u9009\u7684\u6559\u5B66\u7B97\u4F8B\uFF0C\u4E0D\u6267\u884C\u771F\u5B9E\u8BAD\u7EC3\uFF1B\u5B9E\u9645\u53C2\u6570\u66F4\u65B0\u987B\u5C06\u68AF\u5EA6\u53CD\u4F20\u5230\u6A21\u578B\u6743\u91CD\u3002"));
            }
            if (id === 'generation') {
                const seq = ['<bos>', 'I', 'love', 'you', '<eos>'], prob = [[.08, .7, .22], [.07, .84, .09], [.05, .2, .75], [.82, .1, .08]], labels = [['love', 'I', 'you'], ['you', 'love', '<eos>'], ['I', 'love', 'you'], ['<eos>', 'love', 'I']];
                const st = s.generationStep;
                return React.createElement("div", { className: "interactive-card" },
                    React.createElement(LabHeader, { name: "\u81EA\u56DE\u5F52 Token \u751F\u6210\u5668", description: "\u6BCF\u6B21\u70B9\u51FB\u53EA\u751F\u6210\u4E00\u4E2A\u65B0 Token\uFF1B\u65B0 Token \u4F1A\u53D8\u6210\u4E0B\u4E00\u8F6E Decoder \u7684\u8F93\u5165\u3002", badge: "\u63A8\u7406\u5FAA\u73AF" }),
                    React.createElement("div", { className: "generation-stage" },
                        React.createElement("small", null, "CURRENT PREFIX \u00B7 \u5F53\u524D\u524D\u7F00"),
                        React.createElement("div", { className: "generated-tokens" }, seq.slice(0, st + 1).map((t, i) => React.createElement("span", { key: i, className: i === st ? 'fresh' : '' }, t))),
                        React.createElement("div", { className: "generation-arrow" }, "\u2193 Decoder \u2192 \u6700\u540E\u4E00\u884C Logits \u2192 Softmax \u2193"),
                        React.createElement("div", { className: "generation-candidates" }, labels[Math.min(st, 3)].map((t, i) => React.createElement("div", { className: "generation-candidate", key: i },
                            React.createElement("span", null, t),
                            React.createElement(ColorBar, { value: prob[Math.min(st, 3)][i], tone: prob[Math.min(st, 3)][i] === Math.max(...prob[Math.min(st, 3)]) ? 'mint' : 'purple' }),
                            React.createElement("strong", null,
                                Math.round(prob[Math.min(st, 3)][i] * 100),
                                "%")))),
                        React.createElement("div", { className: "generation-result" },
                            React.createElement("span", null, st === 4 ? '停止条件满足' : 'argmax 选出下一个 Token'),
                            React.createElement("strong", null, st === 4 ? '已生成 <eos>，序列结束' : seq[st + 1]))),
                    React.createElement("div", { className: "lab-controls" },
                        React.createElement("button", { className: "subtle-button", onClick: () => change('generationStep', 0) },
                            React.createElement(Icon, { name: "refresh", size: 15 }),
                            " \u91CD\u65B0\u5F00\u59CB"),
                        React.createElement("span", null,
                            "\u5DF2\u751F\u6210 ",
                            st,
                            " \u4E2A Token"),
                        React.createElement("button", { className: "primary-button compact", disabled: st === 4, onClick: () => change('generationStep', Math.min(4, st + 1)) },
                            "\u751F\u6210\u4E0B\u4E00\u4E2A ",
                            React.createElement(Icon, { name: "arrow", size: 16 }))),
                    React.createElement("p", { className: "lab-hint" }, "\u672C\u5B9E\u9A8C\u4F7F\u7528\u9884\u5148\u8BBE\u5B9A\u7684\u7406\u60F3\u8BD1\u6587\u4E0E\u793A\u4F8B\u6982\u7387\uFF0C\u4E0D\u8FD0\u884C\u771F\u5B9E\u8BAD\u7EC3\u597D\u7684\u6A21\u578B\u3002\u6BCF\u8F6E\u6982\u7387\u6392\u5217\u53EA\u7528\u4E8E\u8BF4\u660E argmax\u3002"));
            }
            if (id === 'glossary') {
                const q = s.glossQuery.toLowerCase();
                return React.createElement("div", { className: "interactive-card" },
                    React.createElement(LabHeader, { name: "20 \u4E2A\u5FC5\u77E5\u540D\u8BCD", description: "\u8F93\u5165\u5173\u952E\u8BCD\u5FEB\u901F\u5B9A\u4F4D\u516C\u5F0F\u91CC\u7684\u6982\u5FF5\u3002", badge: "\u53EF\u641C\u7D22" }),
                    React.createElement("div", { className: "searchbar glossary-input" },
                        React.createElement(Icon, { name: "search", size: 17 }),
                        React.createElement("input", { value: s.glossQuery, onChange: (e) => change('glossQuery', e.target.value), placeholder: "\u641C\u7D22\uFF1ASoftmax\u3001Residual\u3001Embedding..." })),
                    React.createElement("div", { className: "glossary-list" }, GLOSSARY.filter(([n, v]) => (n + ' ' + v).toLowerCase().includes(q)).map(([n, v]) => React.createElement("div", { className: "glossary-item", key: n },
                        React.createElement("strong", null, n),
                        React.createElement("p", null, v)))));
            }
            return null;
        };
        let done = [], theme = 'dark';
        try {
            done = JSON.parse(localStorage.getItem('transformer-atlas-done') || '[]');
            theme = localStorage.getItem('transformer-atlas-theme') || 'dark';
        }
        catch (_) {
            done = [];
        }
        this.state = { route: this.getRoute(), done, theme, search: '', menu: false, labStage: 0, tokenInput: '我喜欢编程', embeddingPick: 25, position: 1, dim: 4, qmode: 0, focusKey: -1, normGamma: 1, maskRow: 2, maskEnabled: true, trainingBias: 0, generationStep: 0, glossQuery: '' };
    }
    getRoute() { const m = location.hash.match(/^#\/learn\/([\w-]+)/); return m && LESSONS.some(l => l.id === m[1]) ? m[1] : 'home'; }
    componentDidMount() { window.addEventListener('hashchange', this.onHash); document.documentElement.dataset.theme = this.state.theme; }
    componentWillUnmount() { window.removeEventListener('hashchange', this.onHash); }
    render() {
        const lesson = LESSONS.find(l => l.id === this.state.route);
        const done = this.state.done.length, filter = this.state.search.trim().toLowerCase();
        const filtered = LESSONS.filter(l => !filter || (`${l.title} ${l.en} ${l.eyebrow} ${l.no}`).toLowerCase().includes(filter));
        return React.createElement("div", { className: "app-shell" },
            React.createElement("aside", { className: 'sidebar ' + (this.state.menu ? 'mobile-open' : '') },
                React.createElement("div", { className: "brand", onClick: () => this.go('home'), role: "button" },
                    React.createElement("div", { className: "brand-mark" },
                        React.createElement("div", { className: "brand-mark-center" })),
                    React.createElement("div", { className: "brand-copy" },
                        React.createElement("strong", null,
                            "Transformer ",
                            React.createElement("span", null, "Atlas")),
                        React.createElement("small", null, "\u4ECE\u539F\u7406\u5230\u751F\u6210\u7684\u53EF\u89C6\u5316\u5730\u56FE"))),
                React.createElement("div", { className: "sidebar-label first" },
                    "LEARNING PATH ",
                    React.createElement("span", null, "14 LESSONS")),
                React.createElement("div", { className: "searchbar" },
                    React.createElement(Icon, { name: "search", size: 16 }),
                    React.createElement("input", { placeholder: "\u641C\u7D22\u7AE0\u8282 / \u6982\u5FF5...", value: this.state.search, onChange: (e) => this.set('search', e.target.value), "aria-label": "\u641C\u7D22\u7AE0\u8282" }),
                    React.createElement("span", { className: "shortcut" }, "/")),
                React.createElement("nav", { className: "sidebar-scroll" },
                    React.createElement("button", { className: 'side-home ' + (this.state.route === 'home' ? 'active' : ''), onClick: () => this.go('home') },
                        React.createElement(Icon, { name: "home", size: 17 }),
                        "\u603B\u89C8 \u00B7 \u5B66\u4E60\u9996\u9875",
                        React.createElement(Icon, { name: "chevron", size: 15 })),
                    filtered.map((l, i) => React.createElement("div", { className: "sidebar-item-group", key: l.id },
                        (!i || filtered[i - 1].eyebrow !== l.eyebrow) && React.createElement("div", { className: "nav-group" }, l.eyebrow),
                        React.createElement("button", { onClick: () => this.go(l.id), className: 'side-lesson ' + (this.state.route === l.id ? 'active' : '') },
                            React.createElement("span", { className: "side-index" }, l.no),
                            React.createElement("span", { className: "side-lesson-title" }, l.title),
                            this.state.done.includes(l.id) ? React.createElement("span", { className: "done-dot" },
                                React.createElement(Icon, { name: "check", size: 12 })) : React.createElement("span", { className: "side-trailing" })))),
                    filtered.length === 0 && React.createElement("div", { className: "no-results" }, "\u6CA1\u6709\u5339\u914D\u7AE0\u8282")),
                React.createElement("div", { className: "side-bottom" },
                    React.createElement("div", { className: "side-bottom-label" },
                        React.createElement("span", null, "\u5B66\u4E60\u8FDB\u5EA6"),
                        React.createElement("strong", null,
                            done,
                            " / 14")),
                    React.createElement("div", { className: "progress-track" },
                        React.createElement("div", { style: { width: (done / 14 * 100) + '%' } })),
                    React.createElement("p", null, "\u6BCF\u4E00\u6B65\u90FD\u6709\u8FF9\u53EF\u5FAA\u3002"))),
            this.state.menu && React.createElement("div", { className: "mobile-backdrop", onClick: () => this.set('menu', false) }),
            React.createElement("div", { className: "main-wrap" },
                React.createElement("header", { className: "topbar" },
                    React.createElement("div", { className: "top-left" },
                        React.createElement("button", { className: "mobile-menu icon-button", onClick: () => this.set('menu', !this.state.menu) },
                            React.createElement(Icon, { name: "menu" })),
                        React.createElement("div", { className: "crumb" },
                            React.createElement("span", { onClick: () => this.go('home') }, "Transformer Atlas"),
                            React.createElement(Icon, { name: "chevron", size: 13 }),
                            React.createElement("strong", null, lesson ? lesson.title : '学习总览'))),
                    React.createElement("div", { className: "top-actions" },
                        React.createElement("span", { className: "status" },
                            React.createElement("span", { className: "signal-dot" }),
                            " \u7ECF\u5178 Encoder\u2013Decoder"),
                        React.createElement("button", { title: "\u5207\u6362\u6DF1\u8272/\u6D45\u8272", className: "icon-button", onClick: this.toggleTheme },
                            React.createElement(Icon, { name: this.state.theme === 'dark' ? 'sun' : 'moon', size: 18 })),
                        React.createElement("a", { className: "icon-button", href: "https://github.com/HiRidgewalker/learn-transformer-notebook", target: "_blank", rel: "noreferrer", title: "\u53C2\u8003\u5B66\u4E60\u9879\u76EE" },
                            React.createElement(Icon, { name: "github", size: 18 })))),
                React.createElement("main", { className: "page-container" }, lesson ? this.renderLesson(lesson) : this.renderHome()),
                React.createElement("footer", { className: "site-footer" },
                    React.createElement("span", null, "Transformer Atlas \u00B7 \u7ECF\u5178 Transformer \u4EA4\u4E92\u5F0F\u5B66\u4E60\u624B\u518C"),
                    React.createElement("span", null, "\u672C\u5730\u53EF\u8FD0\u884C \u00B7 \u65E0\u9700\u6A21\u578B API"))));
    }
    renderHome() {
        const done = this.state.done.length;
        return React.createElement("div", { className: "home-page" },
            React.createElement("div", { className: "home-hero" },
                React.createElement("div", { className: "home-hero-noise" }),
                React.createElement("div", { className: "hero-copy" },
                    React.createElement("div", { className: "eyebrow" },
                        React.createElement("span", { className: "eyebrow-line" }),
                        " INTERACTIVE TRANSFORMER JOURNEY ",
                        React.createElement("span", { className: "new-tag" }, "\u4E2D\u6587 \u00B7 \u5F00\u6E90\u53EF\u5B66")),
                    React.createElement("h1", null,
                        "\u4ECE\u4E00\u4E2A Token\uFF0C",
                        React.createElement("br", null),
                        "\u8D70\u5230",
                        React.createElement("span", { className: "hero-gradient" }, "\u4E00\u6574\u4E2A Transformer.")),
                    React.createElement("p", null, "\u4E0D\u8DF3\u6B65\u9AA4\uFF0C\u4E0D\u80CC\u7ED3\u8BBA\u3002\u7528\u53EF\u62D6\u52A8\u7684\u53C2\u6570\u3001\u9010\u7EF4\u8BA1\u7B97\u3001\u52A8\u6001\u8FDE\u7EBF\u4E0E\u516C\u5F0F\uFF0C\u628A\u7ECF\u5178 Encoder\u2013Decoder Transformer \u7684\u6BCF\u4E00\u6B65\u771F\u6B63\u770B\u660E\u767D\u3002"),
                    React.createElement("div", { className: "hero-buttons" },
                        React.createElement("button", { className: "primary-button", onClick: () => this.go(LESSONS.find(l => !this.state.done.includes(l.id))?.id || 'tokenizer') },
                            "\u5F00\u59CB\u63A2\u7D22 ",
                            React.createElement(Icon, { name: "arrow", size: 18 })),
                        React.createElement("button", { className: "secondary-button", onClick: () => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' }) },
                            "\u67E5\u770B\u67B6\u6784\u5168\u56FE ",
                            React.createElement(Icon, { name: "arrow", size: 17 }))),
                    React.createElement("div", { className: "hero-badges" },
                        React.createElement("span", null,
                            React.createElement(Icon, { name: "layers", size: 15 }),
                            " 14 \u4E2A\u7AE0\u8282"),
                        React.createElement("span", null,
                            React.createElement(Icon, { name: "zap", size: 15 }),
                            " \u5B9E\u65F6\u4EA4\u4E92\u6F14\u7B97"),
                        React.createElement("span", null,
                            React.createElement(Icon, { name: "code", size: 15 }),
                            " \u6570\u5B66\u539F\u7406\u53EF\u8FFD\u6EAF"))),
                React.createElement("div", { className: "hero-art", "aria-hidden": "true" },
                    React.createElement("div", { className: "art-orbit orbit-a" }),
                    React.createElement("div", { className: "art-orbit orbit-b" }),
                    React.createElement("div", { className: "art-orbit orbit-c" }),
                    React.createElement("div", { className: "art-node node-q" }, "Q"),
                    React.createElement("div", { className: "art-node node-k" }, "K"),
                    React.createElement("div", { className: "art-node node-v" }, "V"),
                    React.createElement("div", { className: "art-core" },
                        React.createElement("div", { className: "core-rings" }),
                        React.createElement("span", null, "ATTENTION"),
                        React.createElement("strong", null,
                            "QK",
                            React.createElement("sup", null, "T")),
                        React.createElement("small", null,
                            "\u00F7 \u221Ad",
                            React.createElement("sub", null, "k"))),
                    React.createElement("div", { className: "art-caption a" }, "SELF ATTENTION"),
                    React.createElement("div", { className: "art-caption b" }, "SOFTMAX \u00B7 WEIGHTED SUM"))),
            React.createElement("div", { className: "stat-grid" },
                React.createElement("div", { className: "stat-card" },
                    React.createElement("span", null, "01 / LEARNING"),
                    React.createElement("strong", null,
                        "14 ",
                        React.createElement("small", null, "\u7AE0")),
                    React.createElement("p", null, "\u6CBF\u6570\u636E\u6D41\u9010\u6B65\u63A8\u5BFC")),
                React.createElement("div", { className: "stat-card" },
                    React.createElement("span", null, "02 / INTERACTION"),
                    React.createElement("strong", null,
                        "11 ",
                        React.createElement("small", null, "\u7EC4+")),
                    React.createElement("p", null, "\u6BCF\u7AE0\u4E13\u5C5E\u53EF\u89C6\u5316\u5B9E\u9A8C")),
                React.createElement("div", { className: "stat-card" },
                    React.createElement("span", null, "03 / YOUR PROGRESS"),
                    React.createElement("strong", null,
                        done,
                        React.createElement("small", null, " / 14")),
                    React.createElement("p", null,
                        "\u5DF2\u5B8C\u6210\u8BFE\u7A0B ",
                        React.createElement("span", { className: "stat-mini-progress" },
                            Math.round(done / 14 * 100),
                            "%")))),
            React.createElement("section", { id: "architecture", className: "section-space" },
                React.createElement("div", { className: "section-heading" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "section-kicker" }, "THE SYSTEM / \u7ECF\u5178\u67B6\u6784"),
                        React.createElement("h2", null, "\u5148\u770B\u5168\u5C40\uFF0C\u518D\u94BB\u8FDB\u7EC6\u8282"),
                        React.createElement("p", null, "\u70B9\u51FB\u4EFB\u610F\u6A21\u5757\uFF0C\u5373\u53EF\u8DF3\u8F6C\u5230\u5B83\u7684\u8BFE\u7A0B\u9875\u9762\u3002")),
                    React.createElement("span", { className: "section-end-label" },
                        "ENCODER ",
                        React.createElement(Icon, { name: "arrow", size: 14 }),
                        " DECODER")),
                React.createElement("div", { className: "architecture-card" },
                    React.createElement("div", { className: "architecture-shine" }),
                    React.createElement(Architecture, { go: this.go }),
                    React.createElement("div", { className: "architecture-foot" },
                        React.createElement("span", { className: "legend-dot blue" }),
                        " \u7F16\u7801\u6E90\u53E5 ",
                        React.createElement("span", { className: "legend-dot purple" }),
                        " \u751F\u6210\u76EE\u6807\u5E8F\u5217 ",
                        React.createElement("span", { className: "muted-caption" }, "\u4EA4\u53C9\u6CE8\u610F\u529B\u4F7F\u7528 Encoder \u7684 K\u3001V")))),
            React.createElement("section", { className: "section-space" },
                React.createElement("div", { className: "section-heading" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "section-kicker" }, "CURRICULUM / \u5B66\u4E60\u8DEF\u5F84"),
                        React.createElement("h2", null, "\u5FAA\u5E8F\u6E10\u8FDB\u7684 14 \u7AD9"),
                        React.createElement("p", null, "\u6BCF\u4E00\u7AD9\u90FD\u6709\u5B9A\u4E49\u3001\u516C\u5F0F\u3001\u624B\u7B97\u8FC7\u7A0B\u4E0E\u52A8\u6001\u6F14\u793A\u3002"))),
                React.createElement("div", { className: "lesson-grid" }, LESSONS.map(l => React.createElement("button", { className: "lesson-tile", key: l.id, onClick: () => this.go(l.id) },
                    React.createElement("div", { className: "tile-top" },
                        React.createElement("span", { className: "tile-index" },
                            l.no,
                            " ",
                            React.createElement("span", null, "/ 13")),
                        this.state.done.includes(l.id) ? React.createElement("span", { className: "tile-complete" },
                            React.createElement(Icon, { name: "check", size: 13 }),
                            " \u5DF2\u5B66") : React.createElement(Icon, { name: "arrow", size: 16 })),
                    React.createElement("div", { className: "tile-graphic" },
                        React.createElement("span", { className: 'tile-shape shape-' + l.id }, l.id === 'attention' ? 'Q·K' : l.id === 'position' ? 'sin' : l.id === 'ffn' ? '4→8' : l.id === 'training' ? '∇L' : l.id === 'generation' ? '→' : l.id === 'multihead' ? '⊕' : l.id === 'normalization' ? 'μσ' : l.id === 'mask' ? '◩' : l.id === 'decoder' ? 'D' : l.id === 'encoder' ? 'E' : l.id === 'embedding' ? '[ ]' : l.id === 'tokenizer' ? 'ID' : l.id === 'glossary' ? 'ƒ' : 'Σ')),
                    React.createElement("div", { className: "tile-copy" },
                        React.createElement("small", null,
                            l.eyebrow,
                            " \u00B7 ",
                            l.duration),
                        React.createElement("h3", null, l.title),
                        React.createElement("p", null, l.summary)))))),
            React.createElement("section", { className: "closing-banner" },
                React.createElement("div", null,
                    React.createElement("span", { className: "section-kicker" }, "READY TO LEARN?"),
                    React.createElement("h2", null, "\u7406\u89E3\u4ECE\u6765\u4E0D\u662F\u8DF3\u8FC7\u7EC6\u8282\u3002"),
                    React.createElement("p", null, "\u4ECE\u7B2C\u4E00\u884C Token ID \u5F00\u59CB\uFF0C\u6CBF\u7740\u771F\u5B9E\u7684\u6570\u636E\u6D41\u8D70\u5B8C\u6574\u4E2A Transformer\u3002")),
                React.createElement("button", { className: "primary-button", onClick: () => this.go('tokenizer') },
                    "\u4ECE Tokenizer \u5F00\u59CB ",
                    React.createElement(Icon, { name: "arrow", size: 18 }))));
    }
    renderLesson(l) {
        const idx = LESSONS.findIndex(x => x.id === l.id), isDone = this.state.done.includes(l.id), next = LESSONS[idx + 1];
        return React.createElement("div", { className: "lesson-page", key: l.id },
            React.createElement("div", { className: "lesson-topline" },
                React.createElement("button", { onClick: () => this.go('home') },
                    React.createElement(Icon, { name: "back", size: 15 }),
                    " \u8FD4\u56DE\u5B66\u4E60\u5730\u56FE"),
                React.createElement("div", { className: "lesson-counter" },
                    "LESSON ",
                    l.no,
                    " ",
                    React.createElement("span", null, "/ 13"))),
            React.createElement("div", { className: "lesson-hero" },
                React.createElement("div", { className: "lesson-overline" },
                    React.createElement("span", { className: "overline-pip" }),
                    " ",
                    l.eyebrow.toUpperCase(),
                    " ",
                    React.createElement("span", { className: "overline-divider" }),
                    " ",
                    l.en),
                React.createElement("h1", null, l.title),
                React.createElement("p", null, l.summary),
                React.createElement("div", { className: "lesson-meta" },
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "clock", size: 15 }),
                        l.duration),
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "book", size: 15 }),
                        " ",
                        l.steps.length,
                        " \u4E2A\u63A8\u5BFC\u6B65\u9AA4"),
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "zap", size: 15 }),
                        " \u53EF\u4EA4\u4E92\u6F14\u793A"))),
            React.createElement("div", { className: "lesson-columns" },
                React.createElement("div", { className: "lesson-primary" },
                    React.createElement("section", { className: "chapter-intro" },
                        React.createElement("div", { className: "section-card-header" },
                            React.createElement("span", { className: "block-number" }, "01"),
                            React.createElement("span", { className: "block-label" }, "\u5148\u56DE\u7B54\u4E00\u4E2A\u95EE\u9898")),
                        React.createElement("h2", null, l.question),
                        React.createElement("p", null, l.summary),
                        React.createElement("div", { className: "formula-card" },
                            React.createElement("div", { className: "formula-cap" },
                                React.createElement(Icon, { name: "code", size: 16 }),
                                " \u6838\u5FC3\u6570\u5B66\u516C\u5F0F ",
                                React.createElement("span", null, "KEY EQUATION")),
                            React.createElement(MathBlock, { tex: l.formula })),
                        React.createElement("div", { className: "io-strip" },
                            React.createElement("div", null,
                                React.createElement("span", null, "INPUT"),
                                React.createElement("p", null, l.input)),
                            React.createElement(Icon, { name: "arrow", size: 19 }),
                            React.createElement("div", null,
                                React.createElement("span", null, "OUTPUT"),
                                React.createElement("p", null, l.output)))),
                    React.createElement("section", { className: "lesson-section" },
                        React.createElement("div", { className: "section-card-header" },
                            React.createElement("span", { className: "block-number" }, "02"),
                            React.createElement("span", { className: "block-label" }, "\u6253\u5F00\u9ED1\u76D2 \u00B7 \u9010\u6B65\u63A8\u5BFC")),
                        React.createElement("h2", null, "\u6BCF\u4E2A\u6570\u5B57\u662F\u600E\u6837\u8D70\u5230\u4E0B\u4E00\u6B65\u7684\uFF1F"),
                        React.createElement("div", { className: "steps-list" }, l.steps.map((s, i) => React.createElement("div", { className: "explain-step", key: i },
                            React.createElement("div", { className: "step-track" },
                                React.createElement("span", null, i + 1),
                                React.createElement("div", null)),
                            React.createElement("div", { className: "step-detail" },
                                React.createElement("h3", null, s.title),
                                React.createElement("p", null, s.body),
                                React.createElement("div", { className: "math-example" },
                                    React.createElement("span", null, "\u5177\u4F53\u7B97\u4F8B"),
                                    React.createElement("strong", null, s.example),
                                    s.formula && React.createElement(MathBlock, { small: true, tex: s.formula }))))))),
                    React.createElement("section", { className: "lesson-section lab-section" },
                        React.createElement("div", { className: "section-card-header" },
                            React.createElement("span", { className: "block-number" }, "03"),
                            React.createElement("span", { className: "block-label" }, "\u52A8\u624B\u5B9E\u9A8C \u00B7 \u8BA9\u516C\u5F0F\u52A8\u8D77\u6765")),
                        React.createElement(this.Visualization, { id: l.id })),
                    React.createElement("section", { className: "lesson-section" },
                        React.createElement("div", { className: "section-card-header" },
                            React.createElement("span", { className: "block-number" }, "04"),
                            React.createElement("span", { className: "block-label" }, "\u73B0\u5728\u8BB0\u4F4F\u8FD9\u4E00\u70B9")),
                        React.createElement("div", { className: "takeaway-card" },
                            React.createElement("div", { className: "takeaway-icon" },
                                React.createElement(Icon, { name: "target", size: 23 })),
                            React.createElement("div", null,
                                React.createElement("h3", null, "\u6838\u5FC3\u7ED3\u8BBA"),
                                React.createElement("p", null, l.insight))),
                        React.createElement("div", { className: "caution-card" },
                            React.createElement(Icon, { name: "info", size: 18 }),
                            React.createElement("div", null,
                                React.createElement("strong", null, "\u5BB9\u6613\u6DF7\u6DC6\u7684\u5730\u65B9"),
                                React.createElement("p", null, l.caution)))),
                    React.createElement("div", { className: "lesson-navigation" },
                        React.createElement("button", { className: 'mark-done ' + (isDone ? 'complete' : ''), onClick: () => this.toggleDone(l.id) },
                            React.createElement(Icon, { name: "check", size: 18 }),
                            isDone ? '已完成 · 点击撤销' : '标记本章已理解'),
                        next ? React.createElement("button", { className: "next-lesson", onClick: () => this.go(next.id) },
                            React.createElement("span", null,
                                "\u4E0B\u4E00\u7AE0 ",
                                React.createElement("strong", null, next.title)),
                            React.createElement(Icon, { name: "arrow", size: 19 })) : React.createElement("button", { className: "next-lesson", onClick: () => this.go('home') },
                            React.createElement("span", null, "\u8FD4\u56DE\u5B66\u4E60\u603B\u89C8"),
                            React.createElement(Icon, { name: "arrow", size: 19 })))),
                React.createElement("aside", { className: "lesson-aside" },
                    React.createElement("div", { className: "aside-sticky" },
                        React.createElement("span", { className: "aside-heading" }, "IN THIS LESSON"),
                        ['学习目标', '逐步推导', '互动实验', '核心结论'].map((name, i) => React.createElement("button", { key: name, onClick: () => document.querySelectorAll('.lesson-section, .chapter-intro')[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
                            React.createElement("span", null,
                                "0",
                                i + 1),
                            name,
                            React.createElement(Icon, { name: "chevron", size: 13 }))),
                        React.createElement("div", { className: "aside-progress" },
                            React.createElement("span", null, "YOUR JOURNEY"),
                            React.createElement("strong", null,
                                this.state.done.length,
                                " / 14"),
                            React.createElement("div", { className: "progress-track" },
                                React.createElement("div", { style: { width: this.state.done.length / 14 * 100 + '%' } }))),
                        React.createElement("p", { className: "aside-tip" },
                            React.createElement(Icon, { name: "spark", size: 16 }),
                            " \u63A8\u8350\u987A\u5E8F\uFF1A\u5148\u7406\u89E3\u6587\u5B57\u4E0E\u5C0F\u77E9\u9635\uFF0C\u518D\u64CD\u4F5C\u5B9E\u9A8C\uFF0C\u6700\u540E\u56DE\u770B\u516C\u5F0F\u3002")))));
    }
}
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
