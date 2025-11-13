// grammar.js
module.exports = grammar({
  name: "castmagic",

  extras: $ => [
    /\s|\\\r?\n/,
    $.comment,
  ],

    conflicts: $ => [
    [$.expression, $.call_expression],
  ],

  rules: {
    source_file: $ => repeat($.tome_declaration),

    // comments
    comment: $ => token(choice(
      seq("//", /.*/),
      seq("#", /.*/),
      seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")
    )),

    // top-level tome (class)
    tome_declaration: $ => prec(1, seq(
      optional($.visibility_modifier),
      $.tome_keyword,
      $.identifier,
      $.tome_body
    )),

    tome_keyword: _ => "tome",

    // visibility for tomes & rituals 
    visibility_modifier: _ => choice("open", "sealed", "hidden", "known"),

    tome_body: $ => seq(
      "{",
      repeat($.statement),
      "}"
    ),

    // statements allowed inside a tome / block
    statement: $ => choice(
      $.ritual_declaration,
      $.if_statement,
      $.while_statement,
      $.law_declaration,
      $.cast_statement,
      $.conjure_statement,
      $.release_statement,
      $.expression_statement
    ),

    //
    // rituals (functions / methods)
    //
    ritual_declaration: $ => prec(5, seq(
      optional($.visibility_modifier),
      field("return_type", choice($.silent_keyword, $.type, $.tuple_type)),
      field("name", $.identifier),
      $.parameter_list,
      $.block
    )),

    silent_keyword: _ => "silent",

    // parameter list: ( type name, type name )
    parameter_list: $ => seq(
      "(",
      optional(commaSep($.parameter)),
      ")"
    ),

    parameter: $ => seq(
      $.type,
      $.identifier
    ),

    //
    // types
    type: $ => prec(3, seq(
      choice($.rune_type, $.identifier),
      repeat(seq("[", "]"))
    )),

    // tuple return types: (type, type, ...)
    tuple_type: $ => seq(
      "(",
      commaSep($.type),
      ")"
    ),

    rune_type: _ => choice("rune", "sigil", "glyph", "word", "mark", "trace"),

    //
    // other statements
    //
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
      choice($.parenthesized_expression, $.expression),
      $.block
    ),

    while_statement: $ => seq(
      "while",
      choice($.parenthesized_expression, $.expression),
      $.block
    ),

    release_statement: $ => seq(
      "release",
      $.argument_list
    ),

    argument_list: $ => seq(
      "(",
      optional(commaSep($.expression)),
      ")"
    ),

    //
    // blocks & basic expressions
    //
    block: $ => seq(
      "{",
      repeat($.statement),
      "}"
    ),

    expression_statement: $ => prec(1, seq($.expression, optional(";"))),

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

    // binary expressions (left-associative)
    binary_expression: $ => prec.left(1, seq(
      $.expression,
      $.operator,
      $.expression
    )),

    operator: _ => choice("==", "!=", "<", ">", "<=", ">=", "+", "-", "*", "/", "%", "=", "%"),

    //
    // tokens
    //
    identifier: _ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: _ => /\d+(\.\d+)?/,
    string: _ => /"([^"\\]|\\.)*"/,
  },
});

// helper
function commaSep(rule) {
  return seq(rule, repeat(seq(",", rule)));
}
