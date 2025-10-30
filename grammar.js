/**
 * CastMagic Tree-sitter Grammar
 * by Miro ✨
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "castmagic",

  extras: $ => [/\s/, $.comment],

  rules: {
    source_file: $ => repeat($.tome_declaration),

    // === DECLARATIONS ===
    tome_declaration: $ => seq(
      optional($.visibility_modifier),
      $.tome_keyword,
      $.identifier,
      $.tome_body
    ),

    tome_body: $ => seq("{", repeat($.statement), "}"),

    ritual_declaration: $ => seq(
      optional($.visibility_modifier),
      optional($.silent_keyword),
      $.identifier,
      $.parameter_list,
      $.block
    ),

    parameter_list: $ => seq(
      "(",
      optional(commaSep($.parameter)),
      ")"
    ),

    parameter: $ => seq($.type, $.identifier),

    type: $ => choice(
      $.rune_type,
      $.glyph_type,
      $.law_type,
      $.chaos_type,
      $.custom_type
    ),

    custom_type: $ => $.identifier,

    // === STATEMENTS ===
    statement: $ => choice(
      $.if_statement,
      $.while_statement,
      $.law_declaration,
      $.cast_statement,
      $.conjure_statement,
      $.return_statement,
      $.expression_statement,
      $.ritual_declaration
    ),

    if_statement: $ => seq(
      "if",
      $.parenthesized_expression,
      $.block
    ),

    while_statement: $ => seq(
      "while",
      $.parenthesized_expression,
      $.block
    ),

    law_declaration: $ => seq(
      "law",
      $.identifier,
      "=",
      $.expression
    ),

    cast_statement: $ => seq(
      "cast",
      $.expression
    ),

    conjure_statement: $ => seq(
      "conjure",
      $.expression
    ),

    return_statement: $ => seq(
      "release",
      "(",
      commaSep($.expression),
      ")"
    ),

    expression_statement: $ => $.expression,

    // === EXPRESSIONS ===
    expression: $ => choice(
      $.binary_expression,
      $.call_expression,
      $.identifier,
      $.number,
      $.string
    ),

    binary_expression: $ => prec.left(1, seq(
      $.expression,
      choice("=", "+", "-", "*", "/", "<", ">"),
      $.expression
    )),

    call_expression: $ => seq(
      $.identifier,
      "(",
      optional(commaSep($.expression)),
      ")"
    ),

    parenthesized_expression: $ => seq("(", $.expression, ")"),

    block: $ => seq("{", repeat($.statement), "}"),

    // === TERMINALS ===
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: $ => /\d+/,
    string: $ => /"[^"]*"/,

    comment: $ => token(seq("#", /.*/)),

    // === KEYWORDS ===
    visibility_modifier: $ => choice("known", "secret"),
    tome_keyword: $ => "tome",
    silent_keyword: $ => "silent",

    rune_type: $ => "rune",
    glyph_type: $ => "glyph",
    law_type: $ => "law",
    chaos_type: $ => "chaos",
  }
});

// === HELPERS ===
function commaSep(rule) {
  return seq(rule, repeat(seq(",", rule)));
}
