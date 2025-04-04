import { useChat } from '@ai-sdk/react'
import { MessageRenderer } from '../../components'
export const maxDuration = 30

export default function ChatPage() {
  const { error, input, status, handleInputChange, handleSubmit, messages, reload, stop } = useChat({
    api: `${import.meta.env.BIZ_SERVER_URL}/llm/chat`,
  })
  return (
    <div>
      <MessageRenderer messages={messages} status={status} />
      {(status === 'submitted' || status === 'streaming') && (
        <div className="mt-4 text-gray-500">
          {status === 'submitted' && <div>Loading...</div>}
          <button
            type="button"
            className="px-4 py-2 mt-4 text-blue-500 border border-blue-500 rounded-md"
            onClick={stop}
          >
            Stop
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4">
          <div className="text-red-500">An error occurred.</div>
          <button
            type="button"
            className="px-4 py-2 mt-4 text-blue-500 border border-blue-500 rounded-md"
            onClick={() => reload()}
          >
            Retry
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div onClick={() => {}}>销售量最高的前 5 个产品</div>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          disabled={status !== 'ready'}
        />
      </form>
    </div>
  )
}
