/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "castmagic",

  rules: {
    // Top-level file
    source_file: $ => repeat($.tome_declaration),

    tome_declaration: $ => seq(
      $.visibility_modifier,
      $.tome_keyword,
      $.identifier,
      $.tome_body
    ),

    tome_body: $ => seq("{", repeat($.statement), "}"),

    visibility_modifier: $ => choice(
      $.known_keyword,
      $.secret_keyword
    ),

    statement: $ => /[^{}]+/, // placeholder for now

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    // Keywords
    known_keyword: $ => "known",
    secret_keyword: $ => "secret",
    silent_keyword: $ => "silent",
    tome_keyword: $ => "tome",
    rune_type: $ => "rune",
  }
});
