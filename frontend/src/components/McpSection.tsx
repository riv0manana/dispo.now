import { motion } from "framer-motion";
import { Bot, Terminal, CheckCircle2, Cpu } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

const ChatMessage = ({ role, text, delay }: { role: 'user' | 'ai' | 'system', text: string, delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: role === 'user' ? 20 : -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={`flex gap-3 mb-4 ${role === 'user' ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
        ${role === 'ai' ? 'bg-emerald-500/20 text-emerald-400' : 
          role === 'system' ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-700 text-zinc-300'}`}>
        {role === 'ai' ? <Bot size={16} /> : role === 'system' ? <Terminal size={16} /> : <div className="w-2 h-2 bg-white rounded-full" />}
      </div>
      <div className={`p-3 rounded-lg text-sm max-w-[80%] shadow-sm
        ${role === 'user' ? 'bg-zinc-800 text-zinc-200' : 
          role === 'system' ? 'bg-black/50 border border-zinc-800 font-mono text-xs text-blue-300' : 
          'bg-emerald-900/20 border border-emerald-900/50 text-emerald-100'}`}>
        {text}
      </div>
    </motion.div>
  );
};

export const McpSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-[#0F0F0F] border-t border-white/5 overflow-hidden relative">
       {/* Background Elements */}
       <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-6">
                <Cpu size={12} />
                <span>{t('mcp.badge')}</span>
              </div>
              <h2 className="text-4xl font-bold mb-6 text-white tracking-tight">
                {t('mcp.title.part1')} <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">{t('mcp.title.part2')}</span>
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                <Trans i18nKey="mcp.description" components={{ 1: <strong /> }} />
              </p>
              
              <ul className="space-y-4">
                {(t('mcp.points', { returnObjects: true }) as string[]).map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex items-center gap-3 text-zinc-300"
                  >
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Illustration */}
          <div className="relative">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl ring-1 ring-white/5"
            >
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4 justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                    </div>
                    <div className="text-xs text-zinc-500 font-mono ml-2">agent_session_01.log</div>
                </div>
                <div className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400">
                    MCP/1.0
                </div>
              </div>

              <div className="space-y-2 min-h-80">
                <ChatMessage role="user" text={t('mcp.chat.user')} delay={0.2} />
                <ChatMessage role="system" text="> CALL list_resources({ capacity: { gte: 5 } })" delay={1.5} />
                <ChatMessage role="system" text="< Found: 'Conference Room A' (id: res_123)" delay={2.5} />
                <ChatMessage role="system" text="> CALL create_booking({ resourceId: 'res_123', start: '...' })" delay={3.5} />
                <ChatMessage role="ai" text={t('mcp.chat.ai')} delay={4.5} />
              </div>

              {/* Status Indicator */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5.5 }}
                className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">{t('mcp.status')}</span>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
