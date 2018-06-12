/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { definePatternMatcher, getRegExpCalls } = require("../utils")
const hasUnicodePropertyEscape = definePatternMatcher(/\\[pP]\{.+?\}/g)

module.exports = {
    meta: {
        docs: {
            description: "disallow RegExp Unicode property escape sequences.",
            category: "ES2018",
            recommended: false,
            url:
                "http://mysticatea.github.io/eslint-plugin-es/rules/no-regexp-unicode-property-escapes.html",
        },
        fixable: null,
        schema: [],
        messages: {
            forbidden:
                "ES2018 RegExp Unicode property escape sequences are forbidden.",
        },
    },
    create(context) {
        return {
            "Literal[regex]"(node) {
                if (
                    node.regex.flags.includes("u") &&
                    hasUnicodePropertyEscape(node.regex.pattern)
                ) {
                    context.report({ node, messageId: "forbidden" })
                }
            },

            "Program:exit"() {
                const scope = context.getScope()

                for (const { node, pattern, flags } of getRegExpCalls(scope)) {
                    if (
                        flags &&
                        pattern &&
                        flags.includes("u") &&
                        hasUnicodePropertyEscape(pattern)
                    ) {
                        context.report({ node, messageId: "forbidden" })
                    }
                }
            },
        }
    },
}