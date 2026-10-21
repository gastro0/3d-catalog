import { KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { Icon } from './Icon';

export function FilterSelect<Value extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: Value;
  options: readonly { value: Value; label: string }[];
  onChange: (value: Value) => void;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const search = useRef({ text: '', time: 0 });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  useEffect(() => {
    if (!open) return;
    function closeOutside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  useEffect(() => {
    if (open) {
      list.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [open, activeIndex]);

  function show() {
    setActiveIndex(selectedIndex);
    search.current = { text: '', time: 0 };
    setOpen(true);
  }

  function choose(index: number) {
    onChange(options[index].value);
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (!open) show();
        else {
          const direction = event.key === 'ArrowDown' ? 1 : -1;
          setActiveIndex(
            (index) => (index + direction + options.length) % options.length,
          );
        }
        return;
      case 'Home':
      case 'End':
        event.preventDefault();
        if (!open) show();
        setActiveIndex(event.key === 'Home' ? 0 : options.length - 1);
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (open) choose(activeIndex);
        else show();
        return;
      case 'Escape':
        if (open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
        }
        return;
      case 'Tab':
        setOpen(false);
        return;
    }

    if (
      event.key.length !== 1 ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    const now = Date.now();
    const text =
      (now - search.current.time < 600 ? search.current.text : '') +
      event.key.toLocaleLowerCase();
    search.current = { text, time: now };
    const prefix = [...text].every((letter) => letter === text[0])
      ? text[0]
      : text;
    const start = open ? activeIndex : selectedIndex;
    const offset = prefix.length === 1 ? 1 : 0;
    const match = options.findIndex((_, index) => {
      const candidate = (start + offset + index) % options.length;
      return options[candidate].label.toLocaleLowerCase().startsWith(prefix);
    });
    if (!open) show();
    search.current = { text, time: now };
    if (match !== -1) setActiveIndex((start + offset + match) % options.length);
  }

  return (
    <div
      ref={root}
      className="filter-select"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        role="combobox"
        className="filter-select-trigger"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={handleKeyDown}
      >
        <span>{options[selectedIndex].label}</span>
        <Icon name="chevron" className="filter-select-chevron" />
      </button>
      {open && (
        <ul
          ref={list}
          id={`${id}-list`}
          className="filter-select-menu"
          role="listbox"
          aria-label={label}
          onMouseDown={(event) => event.preventDefault()}
        >
          {options.map((option, index) => (
            <li
              id={`${id}-option-${index}`}
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`filter-select-option${
                index === activeIndex ? ' is-active' : ''
              }`}
              onPointerMove={() => setActiveIndex(index)}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <Icon name="check" width="16" height="16" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
