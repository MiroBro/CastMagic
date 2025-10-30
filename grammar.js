module.exports = grammar({
  name: "castmagic",

  extras: $ => [
    /\s|\\\r?\n/,
    $.comment,
  ],

  rules: {
    source_file: $ => repeat($.tome_declaration),

    comment: $ => token(choice(
      seq("//", /.*/),
      seq("#", /.*/),
      seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")
    )),

    tome_declaration: $ => seq(
      optional($.visibility_modifier),
      $.tome_keyword,
      $.identifier,
      $.tome_body
    ),

    tome_keyword: _ => "tome",

    // 👇 Added "known" here
    visibility_modifier: _ => choice("open", "sealed", "hidden", "known"),

    tome_body: $ => seq(
      "{",
      repeat($.statement),
      "}"
    ),

    statement: $ => choice(
      $.ritual_declaration,
      $.if_statement,
      $.law_declaration,
      $.cast_statement,
      $.conjure_statement,
      $.expression_statement
    ),

    ritual_declaration: $ => seq(
      optional($.visibility_modifier),
      optional($.silent_keyword),
      $.identifier,
      $.parameter_list,
      $.block
    ),

    silent_keyword: _ => "silent",

    parameter_list: $ => seq(
      "(",
      optional(commaSep($.parameter)),
      ")"
    ),

    parameter: $ => seq(
      $.type,
      $.identifier
    ),

    type: $ => choice($.rune_type, $.identifier),

    rune_type: _ => choice("rune", "sigil", "glyph", "word", "mark", "trace"),

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

    if_statement: $ => seq(
      "if",
      $.parenthesized_expression,
      $.block
    ),

    block: $ => seq(
      "{",
      repeat($.statement),
      "}"
    ),

    expression_statement: $ => seq($.expression, optional(";")),

    parenthesized_expression: $ => seq(
      "(",
      $.expression,
      ")"
    ),

    expression: $ => choice(
      $.binary_expression,
      $.call_expression,
      $.identifier,
      $.string,
      $.number
    ),

    call_expression: $ => seq(
      field("function", $.identifier),
      "(",
      optional(commaSep($.expression)),
      ")"
    ),

    binary_expression: $ => prec.left(1, seq(
      $.expression,
      $.operator,
      $.expression
    )),

    operator: _ => choice("==", "!=", "<", ">", "<=", ">=", "+", "-", "*", "/", "%"),

    identifier: _ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: _ => /\d+(\.\d+)?/,
    string: _ => /"([^"\\]|\\.)*"/,
  },
});

function commaSep(rule) {
  return seq(rule, repeat(seq(",", rule)));
}
