/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import * as t from "@babel/types"

import { declare } from "@babel/helper-plugin-utils";
import jsx from "@babel/plugin-syntax-jsx";
import helper from "@babel/helper-builder-react-jsx";

const compatTagSet = new Set(
    [
        "template",
        "block",
        "slot",
        "view",
        "image"
    ]
)


const alitamisc = (api, options) => {
    api.assertVersion(7);

    options = {
        ...options,
        pragma: 'h',
        useBuiltIns: true,
        throwIfNamespace: false,
    }

    const THROW_IF_NAMESPACE =
        options.throwIfNamespace === undefined ? true : !!options.throwIfNamespace;

    const PRAGMA_DEFAULT = options.pragma || "React.createElement";
    const PRAGMA_FRAG_DEFAULT = options.pragmaFrag || "React.Fragment";

    const JSX_ANNOTATION_REGEX = /\*?\s*@jsx\s+([^\s]+)/;
    const JSX_FRAG_ANNOTATION_REGEX = /\*?\s*@jsxFrag\s+([^\s]+)/;

    // returns a closure that returns an identifier or memberExpression node
    // based on the given id
    const createIdentifierParser = (id) => () => {
        return id
            .split(".")
            .map(name => t.identifier(name))
            .reduce((object, property) => t.memberExpression(object, property));
    };

    const visitor = helper({
        pre(state) {
            const tagName = state.tagName;
            const args = state.args;

            if (compatTagSet.has(tagName)) {
                args.push(t.stringLiteral(tagName));
            } else if (tagName && tagName.endsWith('CPT')) {
                args.push(t.stringLiteral(tagName));
            } else if (options.stringComps.has(tagName)) {
                args.push(t.stringLiteral(tagName));
            } else {
                args.push(state.tagExpr);
            }
        },

        post(state, pass) {
            state.callee = pass.get("jsxIdentifier")();
        },

        throwIfNamespace: THROW_IF_NAMESPACE,
    });

    visitor.Program = {
        enter(path, state) {
            const { file } = state;

            let pragma = PRAGMA_DEFAULT;
            let pragmaFrag = PRAGMA_FRAG_DEFAULT;
            let pragmaSet = !!options.pragma;
            let pragmaFragSet = !!options.pragmaFrag;

            for (const comment of file.ast.comments) {
                const jsxMatches = JSX_ANNOTATION_REGEX.exec(comment.value);
                if (jsxMatches) {
                    pragma = jsxMatches[1];
                    pragmaSet = true;
                }
                const jsxFragMatches = JSX_FRAG_ANNOTATION_REGEX.exec(comment.value);
                if (jsxFragMatches) {
                    pragmaFrag = jsxFragMatches[1];
                    pragmaFragSet = true;
                }
            }


            state.set("jsxIdentifier", createIdentifierParser(pragma));
            state.set("jsxFragIdentifier", createIdentifierParser(pragmaFrag));
            state.set("usedFragment", false);
            state.set("pragmaSet", pragmaSet);
            state.set("pragmaFragSet", pragmaFragSet);
        },
        exit(path, state) {
            if (
                state.get("pragmaSet") &&
                state.get("usedFragment") &&
                !state.get("pragmaFragSet")
            ) {
                throw new Error(
                    "transform-react-jsx: pragma has been set but " +
                    "pragmafrag has not been set",
                );
            }
        },
    };

    visitor.JSXAttribute = function(path) {
        if (t.isJSXElement(path.node.value)) {
            path.node.value = t.jsxExpressionContainer(path.node.value);
        }

        if (path.type === 'JSXAttribute' && path.node.name.type === 'JSXNamespacedName') {
            path.remove()
        }
    };

    visitor.JSXOpeningElement = function (path) {
        if (path.node.name.name === 'template') {
            path.node.attributes = path.node.attributes.filter(attr => {
                return attr.type === 'JSXAttribute'
                    && (attr.name.name === 'datakey'
                        || attr.name.name === 'tempVnode'
                        || attr.name.name === 'isTextElement'
                    )
            })
        }
    };

    // 由于webpack的babel-loader 默认会使用 module:metro-react-native-babel-preset，导致regeneratorRuntime库引入异常，这里加入
    // 手动处理
    visitor.Identifier = function (path) {
        if (path.node.name === 'regeneratorRuntime') {
            path.node.name = '_ARR' // alita regeneratorRuntime
        }
    }

    return {
        inherits: jsx,
        visitor,
    };
}


export default declare(alitamisc);