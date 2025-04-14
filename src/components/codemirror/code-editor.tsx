import { acceptCompletion } from '@codemirror/autocomplete'
import { indentWithTab } from '@codemirror/commands'
import { LanguageDescription, indentUnit } from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { Compartment, EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { keymap, placeholder } from '@codemirror/view'
import { EditorView, basicSetup } from 'codemirror'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { formatPythonCode } from './utils'

interface CodeEditorProps {
  id: string
  lang: string
  value: string
  boilerplate?: string
  onSave?: () => void
  onChange?: (value: string) => void
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  id,
  lang,
  value,
  boilerplate = '',
  onSave = () => {},
  onChange = () => {},
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const codeEditorRef = useRef<EditorView | null>(null)
  const [_value, setValue] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  const editorTheme = useRef(new Compartment())
  const editorLanguage = useRef(new Compartment())

  // 初始化支持的语言
  useEffect(() => {
    languages.push(
      LanguageDescription.of({
        name: 'HCL',
        extensions: ['hcl', 'tf'],
        load() {
          return import('codemirror-lang-hcl').then((m) => m.hcl())
        },
      }),
    )

    languages.push(
      LanguageDescription.of({
        name: 'Elixir',
        extensions: ['ex', 'exs'],
        load() {
          return import('codemirror-lang-elixir').then((m) => m.elixir())
        },
      }),
    )
  }, [])

  // 查找变化并生成最小更改编辑
  const findChanges = useCallback((oldStr: string, newStr: string) => {
    let changes: { from: number; to: number; insert: string }[] = []
    let oldIndex = 0,
      newIndex = 0

    while (oldIndex < oldStr.length || newIndex < newStr.length) {
      if (oldStr[oldIndex] !== newStr[newIndex]) {
        let start = oldIndex

        // 识别更改部分
        while (oldIndex < oldStr.length && oldStr[oldIndex] !== newStr[newIndex]) {
          oldIndex++
        }
        while (newIndex < newStr.length && newStr[newIndex] !== oldStr[start]) {
          newIndex++
        }

        changes.push({
          from: start,
          to: oldIndex, // 替换不同的部分
          insert: newStr.substring(start, newIndex),
        })
      } else {
        oldIndex++
        newIndex++
      }
    }

    return changes
  }, [])

  // 更新编辑器中的值
  const updateValue = useCallback(() => {
    if (_value !== value) {
      const changes = findChanges(_value, value)
      setValue(value)

      if (codeEditorRef.current && changes.length > 0) {
        codeEditorRef.current.dispatch({ changes })
      }
    }
  }, [_value, value, findChanges])

  // 当外部 value 改变时更新编辑器
  useEffect(() => {
    if (value) {
      updateValue()
    }
  }, [value, updateValue])

  // 设置编辑器语言
  const setLanguage = useCallback(async () => {
    if (!lang) return

    const language = languages.find((l) => l.alias.includes(lang))
    if (!language) return

    const langSupport = await language.load()

    if (langSupport && codeEditorRef.current) {
      codeEditorRef.current.dispatch({
        effects: editorLanguage.current.reconfigure(langSupport),
      })
    }
  }, [lang])

  // 当语言改变时重新设置
  useEffect(() => {
    if (lang) {
      setLanguage()
    }
  }, [lang, setLanguage])

  // 处理 Python 代码格式化
  const formatPythonCodeHandler = async () => {
    if (codeEditorRef.current) {
      try {
        const token = localStorage.getItem('token') || ''
        const res = await formatPythonCode(token, _value)

        if (res && res.code) {
          const formattedCode = res.code
          codeEditorRef.current.dispatch({
            changes: [
              {
                from: 0,
                to: codeEditorRef.current.state.doc.length,
                insert: formattedCode,
              },
            ],
          })

          setValue(formattedCode)
          onChange(formattedCode)

          toast.success('Code formatted successfully')
          return true
        }
        return false
      } catch (error) {
        toast.error(`${error}`)
        return false
      }
    }
    return false
  }

  // 聚焦编辑器
  const focus = () => {
    codeEditorRef.current?.focus()
  }

  // 初始化编辑器
  useEffect(() => {
    if (!editorRef.current) return

    const initialValue = value || boilerplate
    setValue(initialValue)

    // 检查是否为暗黑模式
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)

    const extensions = [
      basicSetup,
      keymap.of([{ key: 'Tab', run: acceptCompletion }, indentWithTab]),
      indentUnit.of('    '),
      placeholder('Enter your code here...'),
      EditorView.updateListener.of((e) => {
        if (e.docChanged) {
          const newValue = e.state.doc.toString()
          setValue(newValue)
          onChange(newValue)
        }
      }),
      editorTheme.current.of([]),
      editorLanguage.current.of([]),
    ]

    codeEditorRef.current = new EditorView({
      state: EditorState.create({
        doc: initialValue,
        extensions,
      }),
      parent: editorRef.current,
    })

    if (isDark) {
      codeEditorRef.current.dispatch({
        effects: editorTheme.current.reconfigure(oneDark),
      })
    }

    // 监听暗黑模式切换
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const newIsDarkMode = document.documentElement.classList.contains('dark')

          if (newIsDarkMode !== isDarkMode) {
            setIsDarkMode(newIsDarkMode)
            if (codeEditorRef.current) {
              codeEditorRef.current.dispatch({
                effects: editorTheme.current.reconfigure(newIsDarkMode ? oneDark : []),
              })
            }
          }
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    // 处理快捷键
    const keydownHandler = async (e: KeyboardEvent) => {
      // 保存快捷键 (Ctrl/Cmd + S)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        onSave()
      }

      // 格式化快捷键 (Ctrl/Cmd + Shift + F)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'f') {
        e.preventDefault()
        await formatPythonCodeHandler()
      }
    }

    document.addEventListener('keydown', keydownHandler)

    // 清理函数
    return () => {
      codeEditorRef.current?.destroy()
      observer.disconnect()
      document.removeEventListener('keydown', keydownHandler)
    }
  }, [boilerplate])

  return <div id={`code-textarea-${id}`} ref={editorRef} className="h-full w-full text-sm" />
}

export default CodeEditor
