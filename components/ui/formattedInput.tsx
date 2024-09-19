'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Bold, Italic, Underline, Link } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

// Add this constant to disable the focus-only preview feature
const ALWAYS_SHOW_PREVIEW = false;

interface FormattedInputProps {
    id: string;
    label: string;
    placeholder: string;
}

export function FormattedInput({ id, label, placeholder }: FormattedInputProps) {
    const { register, setValue, getValues, watch } = useFormContext();
    const [isFocused, setIsFocused] = useState(false);
    const [isValidHTML, setIsValidHTML] = useState(true);

    const textareaRef = useRef<HTMLTextAreaElement>(null);


    const { ref: registerRef, ...rest } = register(id, {
        required: true,
        maxLength: 950,
        validate: (value) => value.length <= 950 || "Maximum length exceeded!",
        onBlur: () => setIsFocused(false),
    });

    const value: string = watch(id);

    useEffect(() => {
        const isValid = isValidHTMLString(value || '');
        setIsValidHTML(isValid);
    }, [value]);

    const applyFormat = (tag: string) => {
        const value = getValues(id) || '';
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const beforeText = value.substring(0, start);
        const afterText = value.substring(end, value.length);

        let formattedText = '';
        if (tag === 'a') {
            const url = prompt('Enter URL:', 'http://');
            if (url) {
                formattedText = `<a href="${url}">${selectedText}</a>`;
            } else {
                return;
            }
        } else {
            formattedText = `<${tag}>${selectedText}</${tag}>`;
        }

        const newValue = beforeText + formattedText + afterText;
        if (newValue.length <= 950) {
            setValue(id, newValue, { shouldValidate: true });
        } else {
            alert("Maximum length exceeded!");
        }
        textarea.focus();
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.ctrlKey) {
            switch (e.key) {
                case 'b':
                    e.preventDefault();
                    applyFormat('b');
                    break;
                case 'i':
                    e.preventDefault();
                    applyFormat('i');
                    break;
                case 'u':
                    e.preventDefault();
                    applyFormat('u');
                    break;
                case 'k':
                    e.preventDefault();
                    applyFormat('a');
                    break;
            }
        }
    }

    const isValidHTMLString = (html: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc.body.innerHTML === html;
    }

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="flex space-x-2 mb-2">
                <Button type="button" variant="outline" size="icon" onClick={() => applyFormat('b')} aria-label="Bold">
                    <Bold className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" size="icon" onClick={() => applyFormat('i')} aria-label="Italic">
                    <Italic className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" size="icon" onClick={() => applyFormat('u')} aria-label="Underline">
                    <Underline className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" size="icon" onClick={() => applyFormat('a')} aria-label="Link">
                    <Link className="h-4 w-4" />
                </Button>
            </div>
            <textarea
                id={id}
                // ref={textareaRef}
                className={`flex h-20 w-full rounded-md border ${isValidHTML ? 'border-input' : 'border-red-500'} bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                // onBlur={() => setIsFocused(false)}
                maxLength={950}
                onKeyDown={handleKeyDown}
                {...rest}
                ref={(e) => {
                    registerRef(e);

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    textareaRef.current = e;
                }}
            />
            {(ALWAYS_SHOW_PREVIEW || isFocused) && (
                <div className={`mt-2 p-2 border rounded-md bg-muted ${isValidHTML ? '' : 'border-red-500'}`}>
                    <p className="text-sm font-medium">Preview:</p>
                    <div className="mt-1 text-sm" dangerouslySetInnerHTML={{ __html: value?.replace(/\n/g, "<br>") || '' }} />
                </div>
            )}
            <p className="text-sm text-muted-foreground">
                Characters: {value ? value.length : 0} / 950
            </p>
        </div>
    )
}