import type { UseChatHelpers } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { G2Chart } from '../g2-hart';

export type MessageRendererProps = {
  messages: UIMessage[];
  status: UseChatHelpers['status'];
};

export const MessageRenderer = (props: MessageRendererProps) => {
  const { messages } = props;
  return (
    <>
      {messages?.map((message) => (
        <div key={message.id}>
          <strong>{`${message.role}: `}</strong>
          {message.parts.map((part) => {
            switch (part.type) {
              // render text parts as simple text:
              case 'text':
                return part.text;

              // for tool invocations, distinguish between the tools and the state:
              case 'tool-invocation': {
                const callId = part.toolInvocation.toolCallId;
                switch (part.toolInvocation.toolName) {
                  case 'sqliteAnalyze': {
                    switch (part.toolInvocation.state) {
                      case 'call':
                        return <div key={callId}>Getting location...</div>;
                      case 'result':
                        return (
                          <div key={callId}>
                            <G2Chart spec={part.toolInvocation.result} />
                          </div>
                        );
                    }
                    break;
                  }
                }
              }
            }
          })}
          <br />
        </div>
      ))}
    </>
  );
};
