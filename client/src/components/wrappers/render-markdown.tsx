import { fileAtom } from '@/atoms'
import { useAtom } from 'jotai'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { ScrollArea } from '../ui/scroll-area'

export const RenderMarkdown = () => {
    const [file] = useAtom(fileAtom)

    return (
        <ScrollArea className='h-screen p-4'>
            <ReactMarkdown
                className={
                    'prose prose-mine max-w-sm sm:max-w-xl md:max-w-full'
                }
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        return match ? (
                            <SyntaxHighlighter
                                style={dark}
                                language={match[1]}
                                PreTag='div'
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code {...props} className={className}>
                                {children}
                            </code>
                        )
                    },
                }}
            >
                {file.content ?? ''}
            </ReactMarkdown>
        </ScrollArea>
    )
}
