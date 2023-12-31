export const languages = [
    { ext: 'html', lang: 'html' },
    { ext: 'md', lang: 'markdown' },
    { ext: 'css', lang: 'css' },
    { ext: 'js', lang: 'javascript' },
    { ext: 'json', lang: 'json' },
    { ext: 'xml', lang: 'xml' },
    { ext: 'java', lang: 'java' },
    { ext: 'txt', lang: 'text' },
    { ext: 'ts', lang: 'typescript' },
]

export const COLORS = [
    'border-red-500',
    'border-orange-500',
    'border-yellow-500',
    'border-green-500',
    'border-teal-500',
    'border-blue-500',
    'border-indigo-500',
    'border-purple-500',
    'border-pink-500',
    'border-rose-500',
    'border-cyan-500',
    'border-emerald-500',
    'border-fuchsia-500',
    'border-lime-500',
    'border-sky-500',
    'border-violet-500',
    'border-amber-500',
]

export const nestedChildrenLoop = (depth: number) => {
    let result: Record<string, any> = {
        children: true,
    }

    for (let i = 0; i < depth; i++) {
        result = { children: { include: result } }
    }

    return result as {
        children: {
            include: {
                children: true
            }
        }
    }
}
