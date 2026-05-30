import type { ReactNode } from 'react';

type Props = {
  command: string;
  args?: string;
  /** the user shown before @host  */
  user?: string;
  /** path shown after host:  */
  path?: string;
  comment?: string;
  cursor?: boolean;
  className?: string;
  children?: ReactNode;
};

/**
 * Renders a terminal prompt like:
 *   abhijay@5cnetwork:~$ ls -la projects/   # latest first
 *
 * Followed by the children as command output.
 */
export function Prompt({
  command,
  args,
  user = 'abhijay',
  path = '~',
  comment,
  cursor = false,
  className = '',
  children,
}: Props) {
  return (
    <div className={className}>
      <div className="prompt-line">
        <span className="prompt-user">{user}</span>
        <span className="prompt-at">@</span>
        <span className="prompt-host">5cnetwork</span>
        <span className="prompt-colon">:</span>
        <span className="prompt-path">{path}</span>
        <span className="prompt-sigil">$</span>
        <span className="prompt-cmd">{command}</span>
        {args && <span className="prompt-flag">{args}</span>}
        {comment && <span className="prompt-comment">{comment}</span>}
        {cursor && <span className="cursor inline-block" />}
      </div>
      {children && (
        <div className="mt-3 md:mt-4 output-block animate-fade-in">{children}</div>
      )}
    </div>
  );
}
