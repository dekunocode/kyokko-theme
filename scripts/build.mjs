// Generates every Kyokko theme file (VS 2026, VS Code, Zed, Windows Terminal) from palette.json.
//
//   node scripts/build.mjs           write all theme files
//   node scripts/build.mjs --check   also fail if a committed file is out of date (used by CI)
//
// No dependencies: runs on any Node.js 18+.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const p = JSON.parse(readFileSync(join(root, 'palette.json'), 'utf8'));
const { ui, text, syntax: sx, status, terminal: term } = p;

// ---------------------------------------------------------------------------
// Zed  (zed/themes/kyokko.json — zed/ is the Zed extension: extension.toml, LICENSE, themes/)
// ---------------------------------------------------------------------------
function zed() {
  const s = {
    'background': ui.bg,
    'border': ui.border,
    'border.variant': ui.surface,
    'border.focused': ui.accent,
    'border.selected': ui.accent,
    'border.transparent': '#00000000',
    'border.disabled': ui.surface,
    'elevated_surface.background': ui.elevated,
    'surface.background': ui.surface,
    'element.background': ui.elevated,
    'element.hover': ui.selection + '80',
    'element.active': ui.selection,
    'element.selected': ui.selection,
    'element.disabled': ui.elevated + '80',
    'drop_target.background': ui.accent + '33',
    'ghost_element.background': '#00000000',
    'ghost_element.hover': ui.selection + '80',
    'ghost_element.active': ui.selection,
    'ghost_element.selected': ui.elevated,
    'ghost_element.disabled': '#00000000',
    'text': text.fg,
    'text.muted': text.muted,
    'text.placeholder': sx.comment,
    'text.disabled': text.lineNumber,
    'text.accent': ui.accent,
    'icon': text.icon,
    'icon.muted': text.muted,
    'icon.disabled': text.lineNumber,
    'icon.placeholder': sx.comment,
    'icon.accent': ui.accent,
    'status_bar.background': ui.surface,
    'title_bar.background': ui.surface,
    'title_bar.inactive_background': ui.deep,
    'toolbar.background': ui.bg,
    'tab_bar.background': ui.surface,
    'tab.inactive_background': ui.surface,
    'tab.active_background': ui.bg,
    // Same as VS: find matches in a dark gold, the debugger's current line in a slightly stronger one
    'search.match_background': mix(sx.special, ui.bg, 0.3),
    'editor.debugger_active_line.background': mix(sx.special, ui.bg, 0.35),
    'panel.background': ui.surface,
    'panel.focused_border': ui.accent,
    'pane.focused_border': ui.accent,
    'scrollbar.thumb.background': ui.border + '99',
    'scrollbar.thumb.hover_background': ui.scrollbar + 'cc',
    'scrollbar.thumb.border': '#00000000',
    'scrollbar.track.background': '#00000000',
    'scrollbar.track.border': '#00000000',
    'editor.foreground': text.fg,
    'editor.background': ui.bg,
    'editor.gutter.background': ui.bg,
    'editor.subheader.background': ui.surface,
    'editor.active_line.background': ui.surface + '99',
    'editor.highlighted_line.background': ui.surface,
    'editor.line_number': text.lineNumber,
    'editor.active_line_number': ui.accent,
    'editor.invisible': ui.border,
    'editor.wrap_guide': ui.guide,
    'editor.active_wrap_guide': ui.border,
    'editor.indent_guide': ui.guide,
    'editor.indent_guide_active': ui.scrollbar,
    'editor.document_highlight.read_background': ui.elevated,
    'editor.document_highlight.write_background': ui.selection,
    'terminal.background': ui.bg,
    'terminal.foreground': text.fg,
    'terminal.bright_foreground': text.fgBright,
    'terminal.dim_foreground': sx.comment,
  };
  const ansi = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
  for (const c of ansi) s[`terminal.ansi.${c}`] = term[c];
  for (const c of ansi) s[`terminal.ansi.bright_${c}`] = term['bright' + c[0].toUpperCase() + c.slice(1)];
  s['link_text.hover'] = ui.accent;

  const states = [
    ['error', status.error], ['warning', status.warning], ['info', status.info], ['hint', sx.comment],
    ['success', status.success], ['created', status.success], ['modified', status.info],
    ['deleted', status.error], ['renamed', ui.accent], ['conflict', status.warning],
    ['ignored', text.lineNumber], ['hidden', text.lineNumber], ['unreachable', text.lineNumber],
    ['predictive', sx.comment],
  ];
  for (const [n, c] of states) {
    s[n] = c;
    s[`${n}.background`] = c + '26';
    s[`${n}.border`] = c + '66';
  }
  // Inlay hints sit on a surface box like VS's inline hints, not a tint of the comment color
  s['hint.background'] = ui.surface;
  s['hint'] = text.muted;

  // Git gutter / diff hunks (VS: track changes and diff use the same status colors)
  s['version_control.added'] = status.success;
  s['version_control.modified'] = status.info;
  s['version_control.deleted'] = status.error;
  s['version_control.conflict_marker.ours'] = status.success + '33';
  s['version_control.conflict_marker.theirs'] = status.info + '33';

  s.players = [
    { cursor: ui.accent, background: ui.accent, selection: ui.selection },
    { cursor: sx.number, background: sx.number, selection: sx.number + '33' },
    { cursor: sx.function, background: sx.function, selection: sx.function + '33' },
  ];

  const c = (color, extra = {}) => ({ color, ...extra });
  s.syntax = {
    'comment': c(sx.comment),
    'comment.doc': c(sx.comment),
    'keyword': c(sx.keyword),
    'operator': c(sx.operator),
    'string': c(sx.string),
    'string.escape': c(sx.escape),
    'string.regex': c(sx.escape),
    'string.special': c(sx.special),
    'string.special.symbol': c(sx.special),
    'number': c(sx.number),
    'boolean': c(sx.number),
    'constant': c(sx.number),
    'function': c(sx.function),
    'type': c(sx.type),
    'constructor': c(sx.type),
    'enum': c(sx.type),
    'variant': c(sx.number),
    'property': c(sx.property),
    'variable': c(text.fg),
    'variable.parameter': c(sx.parameter),
    'variable.special': c(sx.keyword),
    'attribute': c(sx.escape),
    'tag': c(sx.keyword),
    'label': c(sx.special),
    'punctuation': c(sx.punctuation),
    'punctuation.bracket': c(sx.punctuation),
    'punctuation.delimiter': c(sx.punctuation),
    'punctuation.list_marker': c(ui.accent),
    'punctuation.special': c(sx.number),
    'preproc': c(sx.number),
    'embedded': c(text.fg),
    'primary': c(text.fg),
    'title': c(ui.accent, { font_weight: 700 }),
    'emphasis': c(sx.escape, { font_style: 'italic' }),
    'emphasis.strong': c(ui.accent, { font_weight: 700 }),
    'link_text': c(sx.type),
    'link_uri': c(sx.function),
    'text.literal': c(sx.string),
    'hint': c(sx.comment),
    'predictive': c(text.lineNumber, { font_style: 'italic' }),
  };

  return json({
    $schema: 'https://zed.dev/schema/themes/v0.2.0.json',
    name: p.name,
    author: p.author,
    themes: [{ name: p.name, appearance: 'dark', style: s }],
  });
}

// ---------------------------------------------------------------------------
// Windows Terminal  (themes/windows-terminal/kyokko.json — paste into "schemes")
// ---------------------------------------------------------------------------
function windowsTerminal() {
  return json({
    name: p.name,
    background: ui.bg,
    foreground: text.fg,
    cursorColor: ui.accent,
    selectionBackground: ui.selection,
    black: term.black,
    red: term.red,
    green: term.green,
    yellow: term.yellow,
    blue: term.blue,
    purple: term.magenta,
    cyan: term.cyan,
    white: term.white,
    brightBlack: term.brightBlack,
    brightRed: term.brightRed,
    brightGreen: term.brightGreen,
    brightYellow: term.brightYellow,
    brightBlue: term.brightBlue,
    brightPurple: term.brightMagenta,
    brightCyan: term.brightCyan,
    brightWhite: term.brightWhite,
  });
}

// ---------------------------------------------------------------------------
// Visual Studio 2026  (vs/Kyokko.vstheme — compiled into the VSIX by VsixColorCompiler)
//
// VS 2026 reads the new semantic "Shell" / "ShellInternal" tokens first and falls back to
// the built-in Dark theme (FallbackId) for anything not listed here. The legacy categories
// below cover tool windows and the editor, which still use the older tokens.
// See: https://learn.microsoft.com/visualstudio/extensibility/migration/modernize-theme-colors
// ---------------------------------------------------------------------------
const VS_THEME_GUID = '{0f692d25-d509-4a82-8b88-38bf31172dc7}'; // never change: VS stores the user's choice by this id
const VS_DARK_FALLBACK = '{1ded0138-47ce-435e-84ef-9ec1f439b749}';
const NONE = '00000000';

/** '#rrggbb' (+ optional alpha 0-255) → VS 'AARRGGBB' */
function argb(hex, alpha = 255) {
  return alpha.toString(16).padStart(2, '0').toUpperCase() + hex.slice(1).toUpperCase();
}

/** Blend `hex` over `base` (amount 0-1 of `hex`) → '#rrggbb'. For dark tints of palette colors. */
function mix(hex, base, amount) {
  const ch = (h, i) => parseInt(h.slice(i, i + 2), 16);
  return '#' + [1, 3, 5].map((i) =>
    Math.round(ch(hex, i) * amount + ch(base, i) * (1 - amount)).toString(16).padStart(2, '0')).join('');
}

/**
 * The color that, drawn at `alpha` opacity over `base`, shows as `target`. VS draws some editor
 * highlights translucently (measured on screen: selection 40%, find matches and breakpoint lines 80%),
 * so the theme stores a stronger color to land on the palette's tint.
 */
function under(target, alpha, base) {
  const ch = (h, i) => parseInt(h.slice(i, i + 2), 16);
  return '#' + [1, 3, 5].map((i) =>
    Math.min(255, Math.max(0, Math.round(ch(base, i) + (ch(target, i) - ch(base, i)) / alpha))).toString(16).padStart(2, '0')).join('');
}

function vstheme() {
  // [category, guid, [[colorName, background, foreground], ...]]  — B/F are AARRGGBB or null
  const fg = (color) => [null, argb(color)];

  // Shared by the MEF and the older text marker categories
  const squiggles = [
    ['syntax error', ...fg(status.error)],
    ['compiler error', ...fg(status.error)],
    ['other error', ...fg(sx.number)],
    ['compiler warning', ...fg(status.warning)],
    ['hinted suggestion', ...fg(text.muted)],
  ];
  const trackChanges = [
    ['Track Changes before save', argb(status.warning)],
    ['Track Changes after save', argb(status.success)],
    ['Track reverted changes', argb(status.info)],
  ];
  // Breakpoint glyph/line colors under the names the Dark theme defines
  const bpLine = argb(under(mix(status.error, ui.bg, 0.4), 0.8, ui.bg));
  const breakpoints = [];
  for (const kind of ['', ' - Temporary', ' - Dependent', ' - Mapped', ' - Advanced']) {
    for (const state of ['Enabled', 'Warning', 'Error']) breakpoints.push([`Breakpoint${kind} (${state})`, bpLine, argb(text.fgBright)]);
    breakpoints.push([`Breakpoint${kind} (Disabled)`, null, argb(text.lineNumber)]);
  }
  breakpoints.push(['Breakpoint - Selected', null, argb(text.muted)]);
  const cats = [
    ['Shell', '{73708ded-2d56-4aad-b8eb-73b20d3f4bff}', [
      ['AccentFillDefault', argb(ui.accent)],
      ['AccentFillSecondary', argb(ui.accent, 0xe5)],
      ['AccentFillTertiary', argb(ui.accent, 0xcc)],
      // Solid fills step up from deep to border; the Dark fallback uses grays #0a0a0a-#373737.
      ['SolidBackgroundFillBaseAlt', argb(ui.deep)],
      ['SolidBackgroundFillBase', argb(ui.bg)],
      ['SolidBackgroundFillSecondary', argb(ui.deep)],
      ['SolidBackgroundFillTertiary', argb(ui.surface)],
      ['SolidBackgroundFillQuaternary', argb(ui.elevated)],
      ['SolidBackgroundFillQuinary', argb(ui.selection)],
      ['SolidBackgroundFillSenary', argb(ui.border)],
      ['SurfaceBackgroundFillDefault', argb(ui.elevated)],
      ['CardStrokeDefaultSolid', argb(ui.deep)],
      ['ControlSolidFillDefault', argb(ui.border)],
      ['TextFillPrimary', argb(text.fg)],
      ['TextFillSecondary', argb(text.fg, 0xc8)],
      ['TextFillTertiary', argb(text.muted)],
      // Fluent layers controls with translucent white (nav bar, search boxes, hover). Keep the same
      // alphas but tint with the text color so the lift stays blue instead of going gray.
      ['ControlFillDefault', argb(text.fg, 0x0f)],
      ['ControlFillSecondary', argb(text.fg, 0x15)],
      ['ControlFillTertiary', argb(text.fg, 0x08)],
      ['ControlFillQuaternary', argb(text.fg, 0x0f)],
      ['ControlFillDisabled', argb(text.fg, 0x0b)],
      ['ControlAltFillTertiary', argb(text.fg, 0x0b)],
      ['ControlAltFillQuaternary', argb(text.fg, 0x12)],
      ['SubtleFillSecondary', argb(text.fg, 0x0f)],
      ['SubtleFillTertiary', argb(text.fg, 0x0b)],
      ['CardBackgroundFillDefault', argb(text.fg, 0x0d)],
      ['CardBackgroundFillSecondary', argb(text.fg, 0x08)],
      ['CardBackgroundFillTertiary', argb(text.fg, 0x12)],
      ['LayerFillDefault', argb(ui.elevated, 0x4d)],
      ['LayerFillAlt', argb(text.fg, 0x0e)],
      ['ControlStrokeDefault', argb(text.fg, 0x12)],
      ['ControlStrokeSecondary', argb(text.fg, 0x12)],
      ['DividerStrokeDefault', argb(text.fg, 0x15)],
    ]],
    // Window frame, tool window headers and document tabs. The tab strips have no token of their
    // own: they are EnvironmentLayeredBackground drawn over EnvironmentBody.
    ['ShellInternal', '{5af241b7-5627-4d12-bfb1-2b67d11127d7}', [
      ['EnvironmentBackground', argb(ui.deep)],
      ['EnvironmentBody', argb(ui.deep)],
      ['EnvironmentBodyText', argb(text.fg)],
      ['EnvironmentBorder', argb(ui.border)],
      ['EnvironmentBorderInactive', argb(ui.guide)],
      ['EnvironmentHeader', argb(ui.elevated)],
      ['EnvironmentHeaderInactive', argb(ui.surface)],
      ['EnvironmentTab', argb(ui.bg)],
      ['EnvironmentTabInactive', argb(ui.bg)],
      ['EnvironmentIndicator', argb(text.muted, 0x66)],
      ['EnvironmentLogo', argb(ui.accent)],
      ['EnvironmentLayeredBackground', argb(ui.elevated, 0x4d)],
      // Status bar: at rest it stays translucent black over the frame; while busy it takes a dark
      // tint of a palette color (Dark uses purple / brown / blue) so the white text keeps contrast.
      ['StatusBarBackgroundFillBuilding', argb(mix(sx.number, ui.deep, 0.35))],
      ['StatusBarBackgroundFillDebugging', argb(mix(status.error, ui.deep, 0.4))],
      ['StatusBarBackgroundFillSolutionLoading', argb(ui.selection)],
      ['StatusBarTextFillRest', argb(text.fg)],
      ['StatusBarTextFillBuilding', argb(text.fgBright)],
      ['StatusBarTextFillDebugging', argb(text.fgBright)],
      ['StatusBarTextFillSolutionLoading', argb(text.fgBright)],
    ]],
    // CodeLens ("3 references") above members, and its popups. Dark uses gray #999999 / #424245.
    ['CodeSense', '{fc88969a-cbed-4940-8f48-142a503e2381}', [
      ['IndicatorText', ...fg(sx.comment)],
      ['IndicatorTextHovered', ...fg(ui.accent)],
      ['IndicatorTextDisabled', ...fg(text.lineNumber)],
      ['IndicatorSeparator', ...fg(text.lineNumber)],
      ['IndicatorTextSelected', ...fg(text.fg)],
    ]],
    ['CodeSenseControls', '{de7b1121-99a4-4708-aedf-15f40c9b332f}', [
      ['Popup', argb(ui.elevated), argb(text.fg)],
      ['PopupBorder', argb(ui.border)],
      ['PopupSelected', argb(ui.selection)],
      ['PopupSelectedInactive', argb(ui.surface), argb(text.fg)],
      ['PopupHover', argb(ui.selection)],
      ['BodyText', argb(text.fg)],
      ['TextHover', argb(text.fgBright)],
      ['ItemHoverText', argb(text.fgBright)],
      ['SubduedText', argb(text.muted)],
      ['GrayText', argb(text.muted)],
      ['GrayTextHover', argb(text.fg)],
      ['HeaderText', argb(text.muted)],
      ['SubduedBorder', argb(ui.border)],
      ['ActionLink', argb(ui.accent)],
      ['ActionLinkItem', null, argb(ui.accent)],
      ['ActionLinkItemHover', null, argb(text.icon)],
      ['DiffViewHighlight', argb(ui.selection)],
    ]],
    ['Environment', '{624ed9c3-bdfd-41fa-96c3-7c824ea32e3d}', [
      ['Window', argb(ui.bg)],
      ['ToolWindowBackground', argb(ui.surface), argb(text.fg)],
      ['BrandedUIBackground', argb(ui.bg)],
      ['ScrollBarBackground', argb(ui.surface)],
    ]],
    ['TreeView', '{92ecf08e-8b13-4cf4-99e9-ae2692382185}', [
      ['Background', argb(ui.surface), argb(text.fg)],
    ]],
    ['Header', '{4997f547-1379-456e-b985-2f413cdfa536}', [
      ['Default', argb(ui.surface), argb(text.fg)],
    ]],
    ['Output Window', '{9973efdf-317d-431c-8bc1-5e88cbfd4f7f}', [
      ['Plain Text', argb(ui.bg), argb(text.fg)],
    ]],
    ['Find Results', '{5c48b2cb-0366-4fbf-9786-0bb37e945687}', [
      ['Plain Text', argb(ui.bg), argb(text.fg)],
    ]],
    ['Immediate Window', '{6bb65c5a-2f31-4bde-9f48-8a38dc0c63e7}', [
      ['Plain Text', argb(ui.bg), argb(text.fg)],
    ]],
    ['Command Window', '{ee1be240-4e81-4beb-8eea-54322b6b1bf5}', [
      ['Plain Text', argb(ui.bg), argb(text.fg)],
    ]],
    ['Text Editor Text Manager Items', '{58e96763-1d3b-4e05-b6ba-ff7115fd0b7b}', [
      ['Plain Text', argb(ui.bg), argb(text.fg)],
      // Drawn at 40%: these land on ui.selection / ui.elevated
      ['Selected Text', argb(under(ui.selection, 0.4, ui.bg)), NONE],
      ['Inactive Selected Text', argb(under(ui.elevated, 0.4, ui.bg)), NONE],
      ['Line Number', argb(ui.bg), argb(text.lineNumber)],
      ['Selected Line Number', null, argb(ui.accent)],
      ['Visible Whitespace', null, argb(ui.border)],
      ['Indicator Margin', argb(ui.bg), NONE],
    ]],
    ['Text Editor Language Service Items', '{e0187991-b458-4f7e-8ca9-42c9a573b56c}', [
      ['Text', ...fg(text.fg)],
      ['Identifier', ...fg(text.fg)],
      ['Comment', ...fg(sx.comment)],
      ['Keyword', ...fg(sx.keyword)],
      ['Preprocessor Keyword', ...fg(sx.number)],
      ['Operator', ...fg(sx.operator)],
      ['String', ...fg(sx.string)],
      ['String(C# @ Verbatim)', ...fg(sx.string)],
      ['Number', ...fg(sx.number)],
      ['Literal', ...fg(sx.number)],
      ['User Types', ...fg(sx.type)],
      ['User Types(Value types)', ...fg(sx.type)],
      ['User Types(Interfaces)', ...fg(sx.type)],
      ['User Types(Delegates)', ...fg(sx.type)],
      ['User Types(Enums)', ...fg(sx.type)],
      ['User Types(Type parameters)', ...fg(sx.type)],
      // XML / XAML (WPF, Avalonia, .csproj)
      ['XML Text', ...fg(text.fg)],
      ['XML Keyword', ...fg(sx.keyword)],
      ['XML Delimiter', ...fg(sx.punctuation)],
      ['XML Name', ...fg(sx.keyword)],
      ['XML Attribute', ...fg(sx.property)],
      ['XML Attribute Quotes', ...fg(sx.string)],
      ['XML Attribute Value', ...fg(sx.string)],
      ['XML Comment', ...fg(sx.comment)],
      ['XML CData Section', ...fg(sx.string)],
      ['XAML Text', ...fg(text.fg)],
      ['XAML Keyword', ...fg(sx.keyword)],
      ['XAML Delimiter', ...fg(sx.punctuation)],
      ['XAML Name', ...fg(sx.keyword)],
      ['XAML Attribute', ...fg(sx.property)],
      ['XAML Attribute Quotes', ...fg(sx.string)],
      ['XAML Attribute Value', ...fg(sx.string)],
      ['XAML Markup Extension Class', ...fg(sx.type)],
      ['XAML Markup Extension Parameter Name', ...fg(sx.property)],
      ['XAML Markup Extension Parameter Value', ...fg(sx.string)],
      ['XAML Comment', ...fg(sx.comment)],
    ]],
    // Roslyn (C#) semantic colors also live in this category. Unlike Zed, VS knows which
    // identifiers are properties, so members get the pale teal while locals stay white.
    ['Text Editor MEF Items', '{75a05685-00a8-4ded-bae5-e7a50bfa929a}', [
      ['class name', ...fg(sx.type)],
      ['record class name', ...fg(sx.type)],
      ['struct name', ...fg(sx.type)],
      ['record struct name', ...fg(sx.type)],
      ['interface name', ...fg(sx.type)],
      ['enum name', ...fg(sx.type)],
      ['delegate name', ...fg(sx.type)],
      ['module name', ...fg(sx.type)],
      ['type parameter name', ...fg(sx.type)],
      ['method name', ...fg(sx.function)],
      ['extension method name', ...fg(sx.function)],
      ['property name', ...fg(sx.property)],
      ['event name', ...fg(sx.property)],
      ['field name', ...fg(text.fg)],
      ['local name', ...fg(text.fg)],
      ['parameter name', ...fg(sx.parameter)],
      ['constant name', ...fg(sx.number)],
      ['enum member name', ...fg(sx.number)],
      ['namespace name', ...fg(text.muted)],
      ['label name', ...fg(sx.special)],
      ['keyword - control', ...fg(sx.keyword)],
      ['operator - overloaded', ...fg(sx.operator)],
      ['punctuation', ...fg(sx.punctuation)],
      ['string - verbatim', ...fg(sx.string)],
      ['string - escape character', ...fg(sx.escape)],
      ['xml doc comment - text', ...fg(sx.comment)],
      ['xml doc comment - delimiter', ...fg(text.lineNumber)],
      ['xml doc comment - name', ...fg(sx.comment)],
      ['xml doc comment - attribute name', ...fg(sx.comment)],
      ['xml doc comment - attribute value', ...fg(sx.comment)],
      ['xml doc comment - attribute quotes', ...fg(sx.comment)],
      ['xml doc comment - cdata section', ...fg(sx.comment)],
      ['xml doc comment - comment', ...fg(sx.comment)],
      ['xml doc comment - entity reference', ...fg(sx.comment)],
      ['xml doc comment - processing instruction', ...fg(sx.comment)],
      ['preprocessor text', ...fg(text.fg)],
      // VB XML literals (<sky name=<%= Name %>/>). Dark gives embedded expressions a beige box.
      ['xml literal - name', ...fg(sx.keyword)],
      ['xml literal - attribute name', ...fg(sx.property)],
      ['xml literal - attribute quotes', ...fg(sx.string)],
      ['xml literal - attribute value', ...fg(sx.string)],
      ['xml literal - delimiter', ...fg(sx.punctuation)],
      ['xml literal - text', ...fg(text.fg)],
      ['xml literal - comment', ...fg(sx.comment)],
      ['xml literal - cdata section', ...fg(sx.string)],
      ['xml literal - entity reference', ...fg(sx.special)],
      ['xml literal - processing instruction', ...fg(text.muted)],
      ['xml literal - embedded expression', argb(ui.elevated), argb(sx.escape)],
      // Regular expressions inside C# / VB strings
      ['regex - text', ...fg(sx.string)],
      ['regex - self escaped character', ...fg(sx.string)],
      ['regex - other escape', ...fg(sx.escape)],
      ['regex - character class', ...fg(sx.type)],
      ['regex - anchor', ...fg(sx.special)],
      ['regex - quantifier', ...fg(sx.number)],
      ['regex - grouping', ...fg(sx.escape)],
      ['regex - alternation', ...fg(sx.escape)],
      ['regex - comment', ...fg(sx.comment)],
      // Inline parameter/type hints and end-of-line diagnostics (Dark: gray box / red / green / purple)
      ['inline hints', argb(ui.surface), argb(text.muted)],
      ['inline diagnostics - syntax error', argb(mix(status.error, ui.bg, 0.35)), argb(text.fgBright)],
      ['inline diagnostics - compiler warning', argb(mix(status.warning, ui.bg, 0.3)), argb(text.fgBright)],
      ['inline diagnostics - Edit and Continue', argb(mix(sx.number, ui.bg, 0.35)), argb(text.fgBright)],
      ['brace pair level one', ...fg(ui.accent)],
      ['brace pair level two', ...fg(sx.function)],
      ['brace pair level three', ...fg(sx.number)],
      ['mismatched brace', ...fg(status.error)],
      ['brace matching', argb(ui.selection), NONE],
      // Drawn at 80% like FindHighlight: these land on ui.elevated / ui.selection (Zed's document_highlight)
      ['MarkerFormatDefinition/HighlightedReference', argb(under(ui.elevated, 0.8, ui.bg)), NONE],
      ['MarkerFormatDefinition/HighlightedDefinition', argb(under(ui.elevated, 0.8, ui.bg)), NONE],
      ['MarkerFormatDefinition/HighlightedWrittenReference', argb(under(ui.selection, 0.8, ui.bg)), NONE],
      ['CurrentLineActiveFormat', argb(ui.surface, 0x80), argb(ui.surface)],
      // URLs such as xmlns="http://..." (VS default is its own blue). urlformat is a MEF
      // classification, so it has no effect in the language service category above.
      ['urlformat', ...fg(sx.type)],
      // HTML / CSS / JSON (Web Tools editors) are MEF classifications too: listed under the
      // language service category they had no effect, and CSS stayed plain white.
      ['HTML Element Name', ...fg(sx.keyword)],
      ['HTML Attribute Name', ...fg(sx.property)],
      ['HTML Attribute Value', ...fg(sx.string)],
      ['HTML Comment', ...fg(sx.comment)],
      ['HTML Tag Delimiter', ...fg(sx.punctuation)],
      ['HTML Operator', ...fg(sx.operator)],
      ['HTML Entity', ...fg(sx.special)],
      ['CSS Keyword', ...fg(sx.keyword)],
      ['CSS Comment', ...fg(sx.comment)],
      ['CSS Selector', ...fg(sx.function)],
      ['CSS Property Name', ...fg(sx.property)],
      ['CSS Property Value', ...fg(sx.string)],
      ['CSS String Value', ...fg(sx.string)],
      ['JSON Property Name', ...fg(sx.property)],
      // The newer XAML editor classifies markup extensions ({Binding ...}) under MEF items,
      // so set them here as well as in the language service category above.
      ['XAML Markup Extension Class', ...fg(sx.type)],
      ['XAML Markup Extension Parameter Name', ...fg(sx.property)],
      ['XAML Markup Extension Parameter Value', ...fg(sx.string)],
      // Scroll bar in map mode: background, the visible-range box, and the arrow buttons
      ['OverviewMarginBackground', argb(ui.bg), null],
      ['OverviewMarginVisible', argb(ui.selection), argb(ui.border)],
      ['OverviewMarginCaret', null, argb(ui.accent)],
      ['OverviewMarginScrollButtons', argb(ui.bg), argb(text.muted)],
      ['OverviewMarginScrollButtonsMouseOver', argb(ui.bg), argb(ui.scrollbar)],
      ['OverviewMarginScrollButtonsMouseDown', argb(ui.bg), argb(ui.accent)],
      ['OverviewMarginCollapsedRegion', argb(text.muted)],
      // States: squiggles, find/selection highlights, diff, change tracking. Dark uses unrelated
      // hues here (cyan compiler errors, green warnings, brown find matches).
      ...squiggles,
      ['MarkerFormatDefinition/FindHighlight', argb(under(mix(sx.special, ui.bg, 0.3), 0.8, ui.bg)), NONE],
      ['MarkerFormatDefinition/ScopeHighlight', argb(ui.surface)],
      ['MarkerFormatDefinition/SelectedTextInScrollBar', argb(text.muted)],
      ['MarkerFormatDefinition/BookmarkInScrollBar', argb(text.muted)],
      ['MarkerFormatDefinition/BreakpointInScrollBar', argb(status.error)],
      ['Matched Selected Text', argb(ui.elevated), NONE],
      ...trackChanges,
      ['deltadiff.remove.line', argb(mix(status.error, ui.bg, 0.12))],
      ['deltadiff.add.line', argb(mix(status.success, ui.bg, 0.12))],
      ['deltadiff.remove.word', argb(mix(status.error, ui.bg, 0.3)), argb(status.error)],
      ['deltadiff.add.word', argb(mix(status.success, ui.bg, 0.3)), argb(status.success)],
      ['deltadiff.overview.color', argb(ui.surface), argb(ui.border)],
      // Debugger: current statement and breakpoints keep their meaning (gold = here, red = stop)
      // but as dark tints, so the code on those lines stays readable in light text.
      ['Current Statement', argb(mix(sx.special, ui.bg, 0.35)), argb(text.fgBright)],
      ['Current Statement (new context)', argb(mix(sx.string, ui.bg, 0.3)), argb(text.fgBright)],
      ['Current Statement (historical mode)', argb(mix(status.success, ui.bg, 0.3)), argb(text.fgBright)],
      ['RoslynActiveStatementTag', argb(ui.selection)],
      ['Expression Hover Highlight', argb(mix(sx.special, ui.bg, 0.35)), argb(text.fgBright)],
      ...breakpoints,
      // Peek definition, structure guides, collapsed regions, light bulb margin
      ['Peek Background', argb(ui.deep)],
      ['Peek Background Unfocused', argb(ui.surface)],
      ['Peek Focused Border', null, argb(ui.accent)],
      ['Peek Label Text', null, argb(text.fg)],
      ['Peek Highlighted Text', argb(ui.selection)],
      ['Peek Highlighted Text Unfocused', argb(ui.elevated)],
      ['Block Structure Adornments', argb(ui.border)],
      ['Suggestion Margin', argb(ui.bg)],
      ['outlining.chevron.collapsed', argb(ui.bg), argb(text.muted)],
      ['RenameTrackingTag', null, argb(ui.accent)],
      ['RoslynRenameFixupTag', null, argb(status.success)],
    ]],
    // Older marker category: same squiggles, bookmarks and snippet fields.
    ['Text Editor Text Marker Items', '{ff349800-ea43-46c1-8c98-878e78f46501}', [
      ...squiggles,
      ...trackChanges,
      ['Bookmark', argb(mix(sx.special, ui.bg, 0.3)), NONE],
      ['Code Snippet Field (Selected)', argb(ui.selection)],
      ['Brace Matching (Rectangle)', argb(ui.selection), NONE],
      ['Definition Window Current Match', null, argb(sx.special)],
      ['Error Message', null, argb(status.error)],
    ]],
  ];

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const out = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<!-- Generated by scripts/build.mjs from palette.json. Do not edit by hand. -->',
    '<Themes>',
    `  <Theme Name="${p.name}" GUID="${VS_THEME_GUID}" FallbackId="${VS_DARK_FALLBACK}">`,
  ];
  for (const [name, guid, colors] of cats) {
    out.push(`    <Category Name="${esc(name)}" GUID="${guid}">`);
    for (const [cname, bg, fgc] of colors) {
      out.push(`      <Color Name="${esc(cname)}">`);
      if (bg) out.push(`        <Background Type="CT_RAW" Source="${bg}" />`);
      if (fgc) out.push(`        <Foreground Type="CT_RAW" Source="${fgc}" />`);
      out.push('      </Color>');
    }
    out.push('    </Category>');
  }
  out.push('  </Theme>', '</Themes>', '');
  return out.join('\n');
}

// ---------------------------------------------------------------------------
// VS Code  (vscode/themes/kyokko-color-theme.json — vscode/ is the VS Code extension)
//
// Same layering as VS: deep frame (title, activity and status bars, tab strip), bg editor and
// panel, surface side bar and widgets, elevated hovers, selection, border. The vs-dark defaults
// are grays (#252526, #333333, #3c3c3c...), so every area that shows one is listed here.
// ---------------------------------------------------------------------------
function vscode() {
  // VS Code wants some highlights translucent so they don't hide other decorations. Store the
  // color that, at `alpha` over the editor, shows as `target` (as VS does with under()).
  const tint = (target, alpha = 0.8) => under(target, alpha, ui.bg) + Math.round(alpha * 255).toString(16).padStart(2, '0');
  const findMatch = mix(sx.special, ui.bg, 0.3);
  const findCurrent = mix(sx.special, ui.bg, 0.35);

  const colors = {
    // Base
    'foreground': text.fg,
    'descriptionForeground': text.muted,
    'disabledForeground': text.lineNumber,
    'errorForeground': status.error,
    'icon.foreground': text.icon,
    'focusBorder': ui.accent,
    'selection.background': ui.selection,
    'widget.border': ui.border,
    'widget.shadow': ui.deep + '99',
    'sash.hoverBorder': ui.accent,
    'textLink.foreground': ui.accent,
    'textLink.activeForeground': text.icon,
    'textPreformat.foreground': sx.string,
    'textPreformat.background': ui.elevated,
    'textBlockQuote.background': ui.surface,
    'textBlockQuote.border': ui.border,
    'textCodeBlock.background': ui.deep,
    'textSeparator.foreground': ui.border,
    'toolbar.hoverBackground': ui.elevated,
    'toolbar.activeBackground': ui.selection,
    'progressBar.background': ui.accent,
    'badge.background': ui.accent,
    'badge.foreground': ui.deep,
    'profileBadge.background': ui.elevated,
    'profileBadge.foreground': text.fg,

    // Title bar, command center, menus
    'titleBar.activeBackground': ui.deep,
    'titleBar.activeForeground': text.fg,
    'titleBar.inactiveBackground': ui.deep,
    'titleBar.inactiveForeground': text.muted,
    'titleBar.border': ui.deep,
    'commandCenter.background': ui.surface,
    'commandCenter.foreground': text.muted,
    'commandCenter.activeBackground': ui.elevated,
    'commandCenter.activeForeground': text.fg,
    'commandCenter.border': ui.border,
    'commandCenter.activeBorder': ui.scrollbar,
    'commandCenter.inactiveBorder': ui.guide,
    'commandCenter.inactiveForeground': text.lineNumber,
    'menubar.selectionBackground': ui.elevated,
    'menubar.selectionForeground': text.fg,
    'menu.background': ui.surface,
    'menu.foreground': text.fg,
    'menu.selectionBackground': ui.selection,
    'menu.selectionForeground': text.fgBright,
    'menu.separatorBackground': ui.border,
    'menu.border': ui.border,

    // Activity bar
    'activityBar.background': ui.deep,
    'activityBar.foreground': text.fg,
    'activityBar.inactiveForeground': text.muted,
    'activityBar.activeBorder': ui.accent,
    'activityBar.border': ui.deep,
    'activityBar.dropBorder': ui.accent,
    'activityBarBadge.background': ui.accent,
    'activityBarBadge.foreground': ui.deep,
    'activityBarTop.foreground': text.fg,
    'activityBarTop.inactiveForeground': text.muted,
    'activityBarTop.activeBorder': ui.accent,
    'activityBarTop.dropBorder': ui.accent,

    // Side bar
    'sideBar.background': ui.surface,
    'sideBar.foreground': text.fg,
    'sideBar.border': ui.deep,
    'sideBar.dropBackground': ui.accent + '1f',
    'sideBarTitle.foreground': text.fg,
    'sideBarSectionHeader.background': ui.surface,
    'sideBarSectionHeader.foreground': text.fg,
    'sideBarSectionHeader.border': ui.border,
    'sideBarStickyScroll.background': ui.surface,
    'sideBarStickyScroll.shadow': ui.deep,
    'sideBarActivityBarTop.border': ui.border,

    // Lists and trees
    'list.activeSelectionBackground': ui.selection,
    'list.activeSelectionForeground': text.fgBright,
    'list.activeSelectionIconForeground': text.fgBright,
    'list.inactiveSelectionBackground': ui.elevated,
    'list.inactiveSelectionForeground': text.fg,
    'list.hoverBackground': ui.elevated,
    'list.hoverForeground': text.fg,
    'list.focusOutline': ui.accent,
    'list.inactiveFocusOutline': ui.border,
    'list.highlightForeground': ui.accent,
    'list.focusHighlightForeground': ui.accent,
    'list.dropBackground': ui.accent + '26',
    'list.dropBetweenBackground': ui.accent,
    'list.errorForeground': status.error,
    'list.warningForeground': status.warning,
    'list.invalidItemForeground': status.error,
    'list.deemphasizedForeground': text.muted,
    'list.filterMatchBackground': tint(findMatch),
    'list.filterMatchBorder': sx.special + '66',
    'listFilterWidget.background': ui.elevated,
    'listFilterWidget.outline': ui.accent,
    'listFilterWidget.noMatchesOutline': status.error,
    'listFilterWidget.shadow': ui.deep + '99',
    'tree.indentGuidesStroke': ui.border,
    'tree.inactiveIndentGuidesStroke': ui.guide,
    'tree.tableColumnsBorder': ui.border,
    'tree.tableOddRowsBackground': ui.elevated + '66',

    // Editor groups and tabs: the strip sits on the deep frame, the active tab opens onto the editor
    'editorGroup.border': ui.deep,
    'editorGroup.dropBackground': ui.accent + '1f',
    'editorGroup.dropIntoPromptBackground': ui.elevated,
    'editorGroup.dropIntoPromptForeground': text.fg,
    'editorGroup.emptyBackground': ui.bg,
    'editorGroupHeader.tabsBackground': ui.deep,
    'editorGroupHeader.tabsBorder': ui.deep,
    'editorGroupHeader.noTabsBackground': ui.bg,
    'editorGroupHeader.border': ui.deep,
    'editorPane.background': ui.bg,
    'tab.activeBackground': ui.bg,
    'tab.activeForeground': text.fgBright,
    'tab.activeBorder': ui.bg,
    'tab.activeBorderTop': ui.accent,
    'tab.selectedBackground': ui.bg,
    'tab.selectedForeground': text.fgBright,
    'tab.selectedBorderTop': ui.accent,
    'tab.inactiveBackground': ui.deep,
    'tab.inactiveForeground': text.muted,
    'tab.hoverBackground': ui.surface,
    'tab.hoverForeground': text.fg,
    'tab.unfocusedActiveBackground': ui.bg,
    'tab.unfocusedActiveForeground': text.fg,
    'tab.unfocusedActiveBorderTop': ui.border,
    'tab.unfocusedInactiveBackground': ui.deep,
    'tab.unfocusedInactiveForeground': text.lineNumber,
    'tab.unfocusedHoverBackground': ui.surface,
    'tab.border': ui.deep,
    'tab.lastPinnedBorder': ui.border,
    'tab.dragAndDropBorder': ui.accent,
    'tab.activeModifiedBorder': ui.accent,
    'tab.inactiveModifiedBorder': ui.border,
    'breadcrumb.background': ui.bg,
    'breadcrumb.foreground': text.muted,
    'breadcrumb.focusForeground': text.fg,
    'breadcrumb.activeSelectionForeground': ui.accent,
    'breadcrumbPicker.background': ui.surface,

    // Editor
    'editor.background': ui.bg,
    'editor.foreground': text.fg,
    'editorLineNumber.foreground': text.lineNumber,
    'editorLineNumber.activeForeground': ui.accent,
    'editorLineNumber.dimmedForeground': ui.border,
    'editorCursor.foreground': ui.accent,
    'editorCursor.background': ui.deep,
    'editor.selectionBackground': ui.selection,
    'editor.inactiveSelectionBackground': ui.elevated,
    'editor.selectionHighlightBackground': tint(ui.elevated),
    'editor.lineHighlightBackground': tint(ui.surface, 0.6),
    'editor.lineHighlightBorder': '#00000000',
    // Same as VS / Zed document highlights: read = elevated, write = selection
    'editor.wordHighlightBackground': tint(ui.elevated),
    'editor.wordHighlightTextBackground': tint(ui.elevated),
    'editor.wordHighlightStrongBackground': tint(ui.selection),
    // Find matches in dark gold like VS; the current one a little stronger with a gold edge
    'editor.findMatchBackground': tint(findCurrent),
    'editor.findMatchBorder': sx.special + '99',
    'editor.findMatchHighlightBackground': tint(findMatch),
    'editor.findRangeHighlightBackground': tint(ui.surface, 0.6),
    'editor.rangeHighlightBackground': tint(ui.surface, 0.6),
    'editor.hoverHighlightBackground': tint(ui.elevated),
    'editor.foldBackground': tint(ui.surface, 0.5),
    'editor.foldPlaceholderForeground': text.muted,
    'editor.linkedEditingBackground': tint(ui.selection, 0.5),
    'editor.snippetTabstopHighlightBackground': tint(ui.selection, 0.5),
    'editor.snippetFinalTabstopHighlightBorder': ui.accent,
    'editor.placeholder.foreground': sx.comment,
    'editorIndentGuide.background1': ui.guide,
    'editorIndentGuide.activeBackground1': ui.scrollbar,
    'editorWhitespace.foreground': ui.border,
    'editorRuler.foreground': ui.guide,
    'editorLink.activeForeground': ui.accent,
    'editorCodeLens.foreground': sx.comment,
    'editorBracketMatch.background': tint(ui.selection, 0.6),
    'editorBracketMatch.border': ui.accent + '99',
    // Bracket pair colors follow VS's brace pair levels
    'editorBracketHighlight.foreground1': ui.accent,
    'editorBracketHighlight.foreground2': sx.function,
    'editorBracketHighlight.foreground3': sx.number,
    'editorBracketHighlight.foreground4': ui.accent,
    'editorBracketHighlight.foreground5': sx.function,
    'editorBracketHighlight.foreground6': sx.number,
    'editorBracketHighlight.unexpectedBracket.foreground': status.error,
    'editorBracketPairGuide.activeBackground1': ui.accent + '80',
    'editorBracketPairGuide.activeBackground2': sx.function + '80',
    'editorBracketPairGuide.activeBackground3': sx.number + '80',
    'editorError.foreground': status.error,
    'editorWarning.foreground': status.warning,
    'editorInfo.foreground': status.info,
    'editorHint.foreground': text.muted,
    'editorInlayHint.background': ui.surface,
    'editorInlayHint.foreground': text.muted,
    'editorInlayHint.typeBackground': ui.surface,
    'editorInlayHint.typeForeground': text.muted,
    'editorInlayHint.parameterBackground': ui.surface,
    'editorInlayHint.parameterForeground': text.muted,
    'editorGhostText.foreground': text.lineNumber,
    'editorUnicodeHighlight.border': status.warning,
    'editorLightBulb.foreground': status.warning,
    'editorLightBulbAutoFix.foreground': status.success,
    'editorLightBulbAi.foreground': ui.accent,
    'editorStickyScroll.background': ui.bg,
    'editorStickyScroll.shadow': ui.deep,
    'editorStickyScroll.border': ui.border,
    'editorStickyScrollHover.background': ui.surface,
    'editorStickyScrollGutter.background': ui.bg,
    'editorGutter.background': ui.bg,
    'editorGutter.modifiedBackground': status.info,
    'editorGutter.addedBackground': status.success,
    'editorGutter.deletedBackground': status.error,
    'editorGutter.foldingControlForeground': text.muted,
    'editorGutter.commentRangeForeground': ui.border,
    'editorOverviewRuler.border': '#00000000',
    'editorOverviewRuler.background': ui.bg,
    'editorOverviewRuler.findMatchForeground': sx.special,
    'editorOverviewRuler.rangeHighlightForeground': ui.border,
    'editorOverviewRuler.selectionHighlightForeground': text.muted,
    'editorOverviewRuler.wordHighlightForeground': text.muted,
    'editorOverviewRuler.wordHighlightStrongForeground': ui.accent,
    'editorOverviewRuler.bracketMatchForeground': ui.accent,
    'editorOverviewRuler.errorForeground': status.error,
    'editorOverviewRuler.warningForeground': status.warning,
    'editorOverviewRuler.infoForeground': status.info,
    'editorOverviewRuler.modifiedForeground': status.info,
    'editorOverviewRuler.addedForeground': status.success,
    'editorOverviewRuler.deletedForeground': status.error,

    // Editor widgets: find, suggest, hover, peek
    'editorWidget.background': ui.surface,
    'editorWidget.foreground': text.fg,
    'editorWidget.border': ui.border,
    'editorWidget.resizeBorder': ui.accent,
    'editorSuggestWidget.background': ui.surface,
    'editorSuggestWidget.border': ui.border,
    'editorSuggestWidget.foreground': text.fg,
    'editorSuggestWidget.selectedBackground': ui.selection,
    'editorSuggestWidget.selectedForeground': text.fgBright,
    'editorSuggestWidget.selectedIconForeground': text.fgBright,
    'editorSuggestWidget.highlightForeground': ui.accent,
    'editorSuggestWidget.focusHighlightForeground': ui.accent,
    'editorSuggestWidgetStatus.foreground': text.muted,
    'editorHoverWidget.background': ui.surface,
    'editorHoverWidget.foreground': text.fg,
    'editorHoverWidget.border': ui.border,
    'editorHoverWidget.highlightForeground': ui.accent,
    'editorHoverWidget.statusBarBackground': ui.elevated,
    'editorMarkerNavigation.background': ui.surface,
    'editorMarkerNavigationError.background': status.error,
    'editorMarkerNavigationError.headerBackground': status.error + '26',
    'editorMarkerNavigationWarning.background': status.warning,
    'editorMarkerNavigationWarning.headerBackground': status.warning + '26',
    'editorMarkerNavigationInfo.background': status.info,
    'editorMarkerNavigationInfo.headerBackground': status.info + '26',
    'peekView.border': ui.accent,
    'peekViewTitle.background': ui.elevated,
    'peekViewTitleLabel.foreground': text.fgBright,
    'peekViewTitleDescription.foreground': text.muted,
    'peekViewEditor.background': ui.deep,
    'peekViewEditorGutter.background': ui.deep,
    'peekViewEditorStickyScroll.background': ui.deep,
    'peekViewEditor.matchHighlightBackground': tint(findMatch),
    'peekViewResult.background': ui.surface,
    'peekViewResult.fileForeground': text.fg,
    'peekViewResult.lineForeground': text.muted,
    'peekViewResult.selectionBackground': ui.selection,
    'peekViewResult.selectionForeground': text.fgBright,
    'peekViewResult.matchHighlightBackground': tint(findMatch),

    // Diff (VS: whole lines at 12%, changed words at 30% of the status color) and merge
    'diffEditor.insertedLineBackground': status.success + '1f',
    'diffEditor.insertedTextBackground': status.success + '34',
    'diffEditor.removedLineBackground': status.error + '1f',
    'diffEditor.removedTextBackground': status.error + '34',
    'diffEditor.border': ui.border,
    'diffEditor.diagonalFill': ui.border + '80',
    'diffEditor.unchangedRegionBackground': ui.surface,
    'diffEditor.unchangedRegionForeground': text.muted,
    'diffEditor.unchangedCodeBackground': ui.surface + '80',
    'diffEditor.move.border': ui.border,
    'diffEditor.moveActive.border': sx.special,
    'diffEditorGutter.insertedLineBackground': status.success + '33',
    'diffEditorGutter.removedLineBackground': status.error + '33',
    'diffEditorOverview.insertedForeground': status.success + '99',
    'diffEditorOverview.removedForeground': status.error + '99',
    'multiDiffEditor.background': ui.bg,
    'multiDiffEditor.headerBackground': ui.surface,
    'multiDiffEditor.border': ui.border,
    'merge.currentHeaderBackground': status.success + '4d',
    'merge.currentContentBackground': status.success + '1f',
    'merge.incomingHeaderBackground': status.info + '4d',
    'merge.incomingContentBackground': status.info + '1f',
    'merge.commonHeaderBackground': ui.border + '99',
    'merge.commonContentBackground': ui.border + '4d',
    'merge.border': ui.border,
    'mergeEditor.change.background': status.info + '1f',
    'mergeEditor.change.word.background': status.info + '33',
    'mergeEditor.conflict.unhandledUnfocused.border': status.warning + '99',
    'mergeEditor.conflict.unhandledFocused.border': status.warning,
    'mergeEditor.conflict.handledUnfocused.border': status.success + '66',
    'mergeEditor.conflict.handledFocused.border': status.success,

    // Minimap and scroll bars
    'minimap.background': ui.bg,
    'minimap.findMatchHighlight': sx.special,
    'minimap.selectionHighlight': ui.selection,
    'minimap.selectionOccurrenceHighlight': ui.border,
    'minimap.errorHighlight': status.error,
    'minimap.warningHighlight': status.warning,
    'minimap.infoHighlight': status.info,
    'minimapSlider.background': ui.border + '66',
    'minimapSlider.hoverBackground': ui.scrollbar + '66',
    'minimapSlider.activeBackground': ui.scrollbar + '99',
    'minimapGutter.addedBackground': status.success,
    'minimapGutter.modifiedBackground': status.info,
    'minimapGutter.deletedBackground': status.error,
    'scrollbar.shadow': ui.deep,
    'scrollbarSlider.background': ui.border + '99',
    'scrollbarSlider.hoverBackground': ui.scrollbar + 'cc',
    'scrollbarSlider.activeBackground': ui.scrollbar,

    // Panel (terminal, output, problems, debug console)
    'panel.background': ui.bg,
    'panel.border': ui.border,
    'panel.dropBorder': ui.accent,
    'panelTitle.activeForeground': text.fgBright,
    'panelTitle.activeBorder': ui.accent,
    'panelTitle.inactiveForeground': text.muted,
    'panelTitle.border': ui.border,
    'panelTitleBadge.background': ui.accent,
    'panelTitleBadge.foreground': ui.deep,
    'panelInput.border': ui.border,
    'panelSection.border': ui.border,
    'panelSection.dropBackground': ui.accent + '1f',
    'panelSectionHeader.background': ui.surface,
    'panelSectionHeader.foreground': text.fg,
    'panelSectionHeader.border': ui.border,
    'panelStickyScroll.background': ui.bg,
    'panelStickyScroll.shadow': ui.deep,
    'outputView.background': ui.bg,
    'outputViewStickyScroll.background': ui.bg,

    // Terminal
    'terminal.background': ui.bg,
    'terminal.foreground': text.fg,
    'terminal.border': ui.border,
    'terminalCursor.foreground': ui.accent,
    'terminalCursor.background': ui.deep,
    'terminal.selectionBackground': ui.selection,
    'terminal.inactiveSelectionBackground': ui.elevated,
    'terminal.findMatchBackground': findCurrent,
    'terminal.findMatchBorder': sx.special + '99',
    'terminal.findMatchHighlightBackground': tint(findMatch),
    'terminal.hoverHighlightBackground': tint(ui.elevated),
    'terminal.dropBackground': ui.accent + '1f',
    'terminal.tab.activeBorder': ui.accent,
    'terminal.initialHintForeground': text.lineNumber,
    'terminalCommandDecoration.defaultBackground': text.muted,
    'terminalCommandDecoration.successBackground': status.success,
    'terminalCommandDecoration.errorBackground': status.error,
    'terminalOverviewRuler.cursorForeground': ui.accent,
    'terminalOverviewRuler.findMatchForeground': sx.special,
    'terminalStickyScroll.background': ui.bg,
    'terminalStickyScrollHover.background': ui.surface,

    // Status bar: deep at rest like the VS status bar; a dark error tint while debugging
    'statusBar.background': ui.deep,
    'statusBar.foreground': text.fg,
    'statusBar.border': ui.deep,
    'statusBar.focusBorder': ui.accent,
    'statusBar.noFolderBackground': ui.deep,
    'statusBar.noFolderForeground': text.fg,
    'statusBar.noFolderBorder': ui.deep,
    'statusBar.debuggingBackground': mix(status.error, ui.deep, 0.4),
    'statusBar.debuggingForeground': text.fgBright,
    'statusBar.debuggingBorder': mix(status.error, ui.deep, 0.4),
    'statusBarItem.hoverBackground': ui.elevated,
    'statusBarItem.hoverForeground': text.fgBright,
    'statusBarItem.activeBackground': ui.selection,
    'statusBarItem.compactHoverBackground': ui.elevated,
    'statusBarItem.focusBorder': ui.accent,
    'statusBarItem.remoteBackground': ui.selection,
    'statusBarItem.remoteForeground': text.fgBright,
    'statusBarItem.remoteHoverBackground': ui.border,
    'statusBarItem.remoteHoverForeground': text.fgBright,
    'statusBarItem.offlineBackground': mix(status.error, ui.deep, 0.4),
    'statusBarItem.offlineForeground': text.fgBright,
    'statusBarItem.prominentBackground': ui.selection,
    'statusBarItem.prominentForeground': text.fgBright,
    'statusBarItem.prominentHoverBackground': ui.border,
    'statusBarItem.errorBackground': mix(status.error, ui.deep, 0.4),
    'statusBarItem.errorForeground': text.fgBright,
    'statusBarItem.errorHoverBackground': mix(status.error, ui.deep, 0.5),
    'statusBarItem.warningBackground': mix(status.warning, ui.deep, 0.3),
    'statusBarItem.warningForeground': text.fgBright,
    'statusBarItem.warningHoverBackground': mix(status.warning, ui.deep, 0.4),

    // Inputs, dropdowns, buttons
    'input.background': ui.deep,
    'input.foreground': text.fg,
    'input.border': ui.border,
    'input.placeholderForeground': sx.comment,
    'inputOption.activeBackground': ui.selection,
    'inputOption.activeBorder': ui.accent,
    'inputOption.activeForeground': text.fgBright,
    'inputOption.hoverBackground': ui.elevated,
    'inputValidation.errorBackground': mix(status.error, ui.deep, 0.25),
    'inputValidation.errorBorder': status.error,
    'inputValidation.errorForeground': text.fg,
    'inputValidation.warningBackground': mix(status.warning, ui.deep, 0.2),
    'inputValidation.warningBorder': status.warning,
    'inputValidation.warningForeground': text.fg,
    'inputValidation.infoBackground': mix(status.info, ui.deep, 0.2),
    'inputValidation.infoBorder': status.info,
    'inputValidation.infoForeground': text.fg,
    'dropdown.background': ui.deep,
    'dropdown.listBackground': ui.surface,
    'dropdown.border': ui.border,
    'dropdown.foreground': text.fg,
    'checkbox.background': ui.deep,
    'checkbox.border': ui.border,
    'checkbox.foreground': ui.accent,
    'checkbox.selectBackground': ui.surface,
    'checkbox.selectBorder': ui.accent,
    'radio.activeBackground': ui.selection,
    'radio.activeBorder': ui.accent,
    'radio.activeForeground': text.fgBright,
    'radio.inactiveBorder': ui.border,
    'radio.inactiveHoverBackground': ui.elevated,
    'button.background': ui.accent,
    'button.foreground': ui.deep,
    'button.hoverBackground': mix(ui.accent, text.fgBright, 0.3),
    'button.border': '#00000000',
    'button.separator': ui.deep + '66',
    'button.secondaryBackground': ui.elevated,
    'button.secondaryForeground': text.fg,
    'button.secondaryHoverBackground': ui.selection,
    'keybindingLabel.background': ui.elevated,
    'keybindingLabel.foreground': text.fg,
    'keybindingLabel.border': ui.border,
    'keybindingLabel.bottomBorder': ui.border,

    // Quick input (command palette, pickers)
    'quickInput.background': ui.surface,
    'quickInput.foreground': text.fg,
    'quickInputTitle.background': ui.elevated,
    'quickInputList.focusBackground': ui.selection,
    'quickInputList.focusForeground': text.fgBright,
    'quickInputList.focusIconForeground': text.fgBright,
    'pickerGroup.border': ui.border,
    'pickerGroup.foreground': ui.accent,

    // Notifications and banner
    'notificationCenter.border': ui.border,
    'notificationCenterHeader.background': ui.elevated,
    'notificationCenterHeader.foreground': text.fg,
    'notifications.background': ui.surface,
    'notifications.foreground': text.fg,
    'notifications.border': ui.border,
    'notificationToast.border': ui.border,
    'notificationLink.foreground': ui.accent,
    'notificationsErrorIcon.foreground': status.error,
    'notificationsWarningIcon.foreground': status.warning,
    'notificationsInfoIcon.foreground': status.info,
    'banner.background': ui.selection,
    'banner.foreground': text.fgBright,
    'banner.iconForeground': ui.accent,
    'problemsErrorIcon.foreground': status.error,
    'problemsWarningIcon.foreground': status.warning,
    'problemsInfoIcon.foreground': status.info,

    // Debugging: the paused line is a dark gold like VS's current statement
    'editor.stackFrameHighlightBackground': tint(findCurrent),
    'editor.focusedStackFrameHighlightBackground': tint(mix(status.success, ui.bg, 0.3)),
    'editor.inlineValuesBackground': ui.surface,
    'editor.inlineValuesForeground': text.muted,
    'debugToolBar.background': ui.elevated,
    'debugToolBar.border': ui.border,
    'debugIcon.breakpointForeground': status.error,
    'debugIcon.breakpointDisabledForeground': text.lineNumber,
    'debugIcon.breakpointUnverifiedForeground': text.muted,
    'debugIcon.breakpointCurrentStackframeForeground': sx.special,
    'debugIcon.breakpointStackframeForeground': status.success,
    'debugIcon.startForeground': status.success,
    'debugIcon.pauseForeground': status.info,
    'debugIcon.stopForeground': status.error,
    'debugIcon.disconnectForeground': status.error,
    'debugIcon.restartForeground': status.success,
    'debugIcon.stepOverForeground': status.info,
    'debugIcon.stepIntoForeground': status.info,
    'debugIcon.stepOutForeground': status.info,
    'debugIcon.continueForeground': status.info,
    'debugIcon.stepBackForeground': status.info,
    'debugConsole.infoForeground': status.info,
    'debugConsole.warningForeground': status.warning,
    'debugConsole.errorForeground': status.error,
    'debugConsole.sourceForeground': text.muted,
    'debugConsoleInputIcon.foreground': ui.accent,
    'debugTokenExpression.name': sx.property,
    'debugTokenExpression.value': text.fg,
    'debugTokenExpression.string': sx.string,
    'debugTokenExpression.number': sx.number,
    'debugTokenExpression.boolean': sx.keyword,
    'debugTokenExpression.error': status.error,
    'debugTokenExpression.type': sx.type,
    'debugView.exceptionLabelBackground': mix(status.error, ui.deep, 0.4),
    'debugView.exceptionLabelForeground': text.fgBright,
    'debugView.stateLabelBackground': ui.elevated,
    'debugView.stateLabelForeground': text.fg,
    'debugView.valueChangedHighlight': sx.special,
    'debugExceptionWidget.background': mix(status.error, ui.deep, 0.2),
    'debugExceptionWidget.border': status.error,

    // Source control, testing
    'gitDecoration.addedResourceForeground': status.success,
    'gitDecoration.modifiedResourceForeground': status.info,
    'gitDecoration.deletedResourceForeground': status.error,
    'gitDecoration.renamedResourceForeground': ui.accent,
    'gitDecoration.untrackedResourceForeground': status.success,
    'gitDecoration.ignoredResourceForeground': text.lineNumber,
    'gitDecoration.conflictingResourceForeground': status.warning,
    'gitDecoration.stageModifiedResourceForeground': status.info,
    'gitDecoration.stageDeletedResourceForeground': status.error,
    'gitDecoration.submoduleResourceForeground': text.muted,
    'scm.historyItemAdditionsForeground': status.success,
    'scm.historyItemDeletionsForeground': status.error,
    'scm.historyItemStatisticsBorder': ui.border,
    'scm.historyItemSelectedStatisticsBorder': text.muted,
    'testing.iconPassed': status.success,
    'testing.iconFailed': status.error,
    'testing.iconErrored': status.error,
    'testing.iconQueued': status.warning,
    'testing.iconUnset': text.muted,
    'testing.iconSkipped': text.muted,
    'testing.runAction': status.success,
    'testing.peekBorder': status.error,
    'testing.peekHeaderBackground': status.error + '1a',
    'testing.message.error.lineBackground': status.error + '1a',
    'testing.message.info.lineBackground': status.info + '1a',
    'testing.coveredBackground': status.success + '1a',
    'testing.uncoveredBackground': status.error + '1a',

    // Settings, welcome page, extensions, notebooks, chat
    'settings.headerForeground': text.fgBright,
    'settings.modifiedItemIndicator': ui.accent,
    'settings.dropdownBackground': ui.deep,
    'settings.dropdownBorder': ui.border,
    'settings.dropdownListBorder': ui.border,
    'settings.checkboxBackground': ui.deep,
    'settings.checkboxBorder': ui.border,
    'settings.textInputBackground': ui.deep,
    'settings.textInputBorder': ui.border,
    'settings.numberInputBackground': ui.deep,
    'settings.numberInputBorder': ui.border,
    'settings.rowHoverBackground': ui.surface + '80',
    'settings.focusedRowBackground': ui.surface,
    'settings.focusedRowBorder': ui.accent,
    'settings.sashBorder': ui.border,
    'settings.headerBorder': ui.border,
    'welcomePage.background': ui.bg,
    'welcomePage.tileBackground': ui.surface,
    'welcomePage.tileHoverBackground': ui.elevated,
    'welcomePage.tileBorder': ui.border,
    'welcomePage.progress.background': ui.elevated,
    'welcomePage.progress.foreground': ui.accent,
    'walkThrough.embeddedEditorBackground': ui.deep,
    'walkthrough.stepTitle.foreground': text.fgBright,
    'extensionButton.background': ui.accent,
    'extensionButton.foreground': ui.deep,
    'extensionButton.hoverBackground': mix(ui.accent, text.fgBright, 0.3),
    'extensionButton.separator': ui.deep + '66',
    'extensionButton.prominentBackground': ui.accent,
    'extensionButton.prominentForeground': ui.deep,
    'extensionButton.prominentHoverBackground': mix(ui.accent, text.fgBright, 0.3),
    'extensionBadge.remoteBackground': ui.accent,
    'extensionBadge.remoteForeground': ui.deep,
    'extensionIcon.starForeground': sx.special,
    'extensionIcon.verifiedForeground': ui.accent,
    'extensionIcon.preReleaseForeground': sx.number,
    'extensionIcon.sponsorForeground': status.error,
    'notebook.editorBackground': ui.bg,
    'notebook.cellEditorBackground': ui.deep,
    'notebook.cellBorderColor': ui.border,
    'notebook.focusedCellBorder': ui.accent,
    'notebook.focusedEditorBorder': ui.accent,
    'notebook.selectedCellBackground': ui.surface,
    'notebook.selectedCellBorder': ui.border,
    'notebook.cellHoverBackground': ui.surface + '80',
    'notebook.outputContainerBackgroundColor': ui.surface,
    'notebook.outputContainerBorderColor': ui.border,
    'notebook.cellToolbarSeparator': ui.border,
    'notebook.cellStatusBarItemHoverBackground': ui.elevated,
    'notebookStatusSuccessIcon.foreground': status.success,
    'notebookStatusErrorIcon.foreground': status.error,
    'notebookStatusRunningIcon.foreground': ui.accent,
    'chat.requestBackground': ui.surface,
    'chat.requestBorder': ui.border,
    'chat.slashCommandBackground': ui.elevated,
    'chat.slashCommandForeground': ui.accent,
    'chat.avatarBackground': ui.elevated,
    'chat.avatarForeground': text.fg,
    'chat.editedFileForeground': status.info,
    'interactive.activeCodeBorder': ui.accent,
    'interactive.inactiveCodeBorder': ui.border,
    'inlineChat.background': ui.surface,
    'inlineChat.foreground': text.fg,
    'inlineChat.border': ui.border,
    'inlineChat.shadow': ui.deep + '99',
    'inlineChatInput.background': ui.deep,
    'inlineChatInput.border': ui.border,
    'inlineChatInput.focusBorder': ui.accent,
    'inlineChatInput.placeholderForeground': sx.comment,
    'inlineChatDiff.inserted': status.success + '26',
    'inlineChatDiff.removed': status.error + '26',
    'editorCommentsWidget.resolvedBorder': ui.border,
    'editorCommentsWidget.unresolvedBorder': ui.accent,
    'editorCommentsWidget.rangeBackground': ui.accent + '1a',
    'editorCommentsWidget.rangeActiveBackground': ui.accent + '26',
    'ports.iconRunningProcessForeground': status.success,
    'search.resultsInfoForeground': text.muted,
    'searchEditor.findMatchBackground': tint(findMatch),
    'searchEditor.findMatchBorder': sx.special + '66',
    'searchEditor.textInputBorder': ui.border,
    'charts.foreground': text.fg,
    'charts.lines': ui.border,
    'charts.red': status.error,
    'charts.blue': status.info,
    'charts.yellow': status.warning,
    'charts.orange': sx.string,
    'charts.green': status.success,
    'charts.purple': sx.number,

    // Outline / suggest / breadcrumb icons: the same roles as the code colors
    'symbolIcon.arrayForeground': sx.type,
    'symbolIcon.booleanForeground': sx.keyword,
    'symbolIcon.classForeground': sx.type,
    'symbolIcon.colorForeground': sx.special,
    'symbolIcon.constantForeground': sx.number,
    'symbolIcon.constructorForeground': sx.function,
    'symbolIcon.enumeratorForeground': sx.type,
    'symbolIcon.enumeratorMemberForeground': sx.number,
    'symbolIcon.eventForeground': sx.property,
    'symbolIcon.fieldForeground': text.fg,
    'symbolIcon.fileForeground': text.muted,
    'symbolIcon.folderForeground': text.muted,
    'symbolIcon.functionForeground': sx.function,
    'symbolIcon.interfaceForeground': sx.type,
    'symbolIcon.keyForeground': sx.property,
    'symbolIcon.keywordForeground': sx.keyword,
    'symbolIcon.methodForeground': sx.function,
    'symbolIcon.moduleForeground': text.muted,
    'symbolIcon.namespaceForeground': text.muted,
    'symbolIcon.nullForeground': sx.keyword,
    'symbolIcon.numberForeground': sx.number,
    'symbolIcon.objectForeground': sx.type,
    'symbolIcon.operatorForeground': sx.operator,
    'symbolIcon.packageForeground': text.muted,
    'symbolIcon.propertyForeground': sx.property,
    'symbolIcon.referenceForeground': ui.accent,
    'symbolIcon.snippetForeground': text.muted,
    'symbolIcon.stringForeground': sx.string,
    'symbolIcon.structForeground': sx.type,
    'symbolIcon.textForeground': text.fg,
    'symbolIcon.typeParameterForeground': sx.type,
    'symbolIcon.unitForeground': sx.number,
    'symbolIcon.variableForeground': text.fg,
  };

  const ansi = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
  for (const c of ansi) {
    const cap = c[0].toUpperCase() + c.slice(1);
    colors[`terminal.ansi${cap}`] = term[c];
    colors[`terminal.ansiBright${cap}`] = term['bright' + cap];
  }

  // TextMate scopes. Later rules win over earlier ones of the same specificity, so the generic
  // scopes come first. No rule sets italic (Japanese comments stay readable).
  const rule = (name, scope, foreground, fontStyle) => ({ name, scope, settings: fontStyle === undefined ? { foreground } : { foreground, fontStyle } });
  const tokenColors = [
    rule('Text', ['source', 'text'], text.fg),
    rule('Comment', ['comment', 'punctuation.definition.comment', 'string.quoted.docstring'], sx.comment, ''),
    rule('Doc comment tags', ['comment.documentation', 'comment.block.documentation', 'comment.line.documentation', 'storage.type.class.jsdoc', 'entity.name.type.instance.jsdoc'], sx.comment, ''),
    rule('Keyword', ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.other', 'keyword.type', 'variable.language', 'support.type.primitive', 'support.type.builtin', 'keyword.operator.new', 'keyword.operator.expression', 'keyword.operator.logical.python', 'keyword.operator.wordlike', 'constant.language', 'support.constant.json', 'variable.language.this', 'variable.language.self'], sx.keyword),
    rule('Operator', ['keyword.operator', 'punctuation.accessor', 'punctuation.separator.key-value', 'storage.type.function.arrow'], sx.operator),
    rule('Operator words', ['keyword.operator.new', 'keyword.operator.expression', 'keyword.operator.logical.python', 'keyword.operator.wordlike', 'keyword.operator.sizeof', 'keyword.operator.typeof', 'keyword.operator.instanceof', 'keyword.operator.cast', 'keyword.operator.nameof'], sx.keyword),
    rule('Punctuation', ['punctuation', 'meta.brace', 'punctuation.definition.tag', 'punctuation.separator', 'punctuation.terminator'], sx.punctuation),
    rule('String', ['string', 'punctuation.definition.string', 'string.quoted', 'string.template', 'markup.inline.raw', 'markup.raw', 'markup.fenced_code.block'], sx.string),
    rule('Escape', ['constant.character.escape', 'constant.character.entity', 'string.escape', 'constant.other.placeholder', 'punctuation.section.embedded', 'punctuation.definition.template-expression', 'punctuation.definition.interpolation', 'punctuation.definition.interpolation.begin', 'punctuation.definition.interpolation.end'], sx.escape),
    rule('Regex', ['string.regexp'], sx.string),
    rule('Regex parts', ['string.regexp constant.character.escape', 'string.regexp punctuation.definition.group', 'string.regexp keyword.operator.or', 'string.regexp meta.group'], sx.escape),
    rule('Regex classes', ['string.regexp constant.other.character-class', 'string.regexp constant.character.character-class', 'string.regexp punctuation.definition.character-class'], sx.type),
    rule('Regex anchors and quantifiers', ['string.regexp keyword.control.anchor', 'string.regexp keyword.operator.quantifier', 'string.regexp keyword.operator.quantifier.regexp'], sx.number),
    rule('Number and constant', ['constant.numeric', 'constant', 'support.constant', 'constant.other.enum', 'variable.other.enummember', 'variable.other.constant', 'entity.name.variable.enum-member', 'keyword.other.unit'], sx.number),
    rule('Language constant', ['constant.language', 'constant.language.boolean', 'constant.language.null', 'constant.language.undefined', 'support.constant.json'], sx.keyword),
    rule('Function', ['entity.name.function', 'support.function', 'meta.function-call.generic', 'meta.function-call entity.name.function', 'entity.name.function.member', 'variable.function', 'support.function.powershell', 'entity.name.function.powershell'], sx.function),
    rule('Type', ['entity.name.type', 'entity.name.class', 'entity.name.struct', 'entity.name.enum', 'entity.name.interface', 'entity.name.type.parameter', 'entity.other.inherited-class', 'support.class', 'support.type', 'storage.type.cs', 'storage.type.java', 'entity.name.type.class', 'meta.type.annotation entity.name.type', 'storage.type.generic', 'entity.name.scope-resolution'], sx.type),
    rule('Built-in types as keywords', ['support.type.primitive', 'support.type.builtin', 'keyword.type', 'storage.type.primitive', 'storage.type.built-in'], sx.keyword),
    rule('Variable', ['variable', 'variable.other', 'variable.other.readwrite', 'entity.name.variable', 'entity.name.variable.local', 'entity.name.variable.field', 'variable.other.object', 'meta.definition.variable variable', 'variable.other.readwrite.powershell', 'punctuation.definition.variable.powershell'], text.fg),
    rule('Parameter', ['variable.parameter', 'entity.name.variable.parameter', 'meta.parameter variable', 'variable.parameter.function'], sx.parameter),
    rule('Property and event', ['variable.other.property', 'variable.other.object.property', 'support.variable.property', 'entity.name.variable.property', 'entity.name.variable.event', 'meta.object-literal.key', 'support.type.property-name', 'support.type.vendored.property-name', 'entity.name.tag.yaml', 'entity.name.tag.toml', 'support.type.property-name.toml', 'keyword.other.definition.ini', 'entity.other.attribute-name'], sx.property),
    rule('JSON keys', ['support.type.property-name.json', 'support.type.property-name.json punctuation', 'meta.structure.dictionary.key.json string'], sx.property),
    rule('Namespace', ['entity.name.namespace', 'entity.name.type.namespace', 'entity.name.package', 'storage.modifier.import', 'storage.modifier.package', 'support.other.namespace'], text.muted),
    rule('Label', ['entity.name.label', 'entity.name.goto-label', 'punctuation.definition.label'], sx.special),
    rule('Preprocessor', ['meta.preprocessor', 'keyword.preprocessor', 'keyword.control.directive', 'punctuation.separator.hash', 'entity.name.function.preprocessor', 'meta.preprocessor.cs keyword'], sx.number),
    rule('Attribute / decorator', ['meta.decorator', 'punctuation.decorator', 'entity.name.function.decorator', 'meta.attribute', 'storage.type.annotation', 'punctuation.definition.annotation'], sx.escape),
    // Markup (HTML, XML, XAML)
    rule('Tag', ['entity.name.tag', 'meta.tag.sgml', 'entity.name.tag.localname', 'support.class.component'], sx.keyword),
    rule('Tag attribute', ['entity.other.attribute-name', 'entity.other.attribute-name.localname'], sx.property),
    rule('Tag namespace prefix', ['entity.name.tag.namespace', 'entity.other.attribute-name.namespace'], text.muted),
    rule('Tag punctuation', ['punctuation.definition.tag', 'punctuation.separator.namespace', 'punctuation.definition.tag.begin', 'punctuation.definition.tag.end'], sx.punctuation),
    rule('Entity', ['constant.character.entity', 'punctuation.definition.entity'], sx.special),
    rule('URL', ['string.other.link', 'constant.other.reference.link'], sx.type),
    // CSS: selectors like VS (function color), properties, values
    rule('CSS selector', ['entity.other.attribute-name.class.css', 'entity.other.attribute-name.id.css', 'entity.other.attribute-name.pseudo-class', 'entity.other.attribute-name.pseudo-element', 'entity.name.tag.css', 'meta.selector'], sx.function),
    rule('CSS property', ['support.type.property-name.css', 'support.type.property-name.scss', 'support.type.property-name.less', 'variable.css', 'variable.scss'], sx.property),
    rule('CSS value', ['support.constant.property-value', 'support.constant.color', 'support.constant.font-name', 'meta.property-value'], sx.string),
    rule('CSS units and numbers', ['constant.numeric.css', 'keyword.other.unit.css', 'constant.other.color.rgb-value'], sx.number),
    rule('CSS at-rule', ['keyword.control.at-rule', 'punctuation.definition.keyword.css'], sx.keyword),
    // Markdown
    rule('Heading', ['markup.heading', 'markup.heading entity.name', 'entity.name.section'], ui.accent, 'bold'),
    rule('Heading marker', ['punctuation.definition.heading'], ui.accent),
    rule('Bold', ['markup.bold'], ui.accent, 'bold'),
    rule('Italic (colored, not slanted)', ['markup.italic'], sx.escape, ''),
    rule('Strikethrough', ['markup.strikethrough'], text.muted, 'strikethrough'),
    rule('Link text', ['string.other.link.title', 'string.other.link.description', 'meta.link.inline.markdown string.other.link'], sx.type),
    rule('Link URL', ['markup.underline.link', 'meta.link.inline.markdown markup.underline.link', 'meta.image.inline.markdown markup.underline.link'], sx.function),
    rule('List marker', ['punctuation.definition.list.begin', 'beginning.punctuation.definition.list', 'punctuation.definition.list_item'], ui.accent),
    rule('Quote', ['markup.quote', 'punctuation.definition.quote.begin'], sx.comment),
    rule('Fenced code language', ['fenced_code.block.language', 'markup.fenced_code.block.language'], text.muted),
    rule('Inserted', ['markup.inserted', 'punctuation.definition.inserted'], status.success),
    rule('Deleted', ['markup.deleted', 'punctuation.definition.deleted'], status.error),
    rule('Changed', ['markup.changed', 'punctuation.definition.changed'], status.info),
    rule('Diff header', ['meta.diff.header', 'meta.diff.range', 'punctuation.definition.range.diff'], sx.number),
    rule('Invalid', ['invalid', 'invalid.illegal'], status.error),
    rule('Deprecated', ['invalid.deprecated'], status.warning),
    // PowerShell: $ variables stay body text, -Parameters take the parameter color
    rule('PowerShell scope', ['support.variable.drive.powershell', 'storage.modifier.scope.powershell'], text.muted),
    rule('PowerShell automatic variable', ['support.constant.variable.powershell', 'support.variable.automatic.powershell', 'variable.language.powershell'], sx.keyword),
    rule('PowerShell member', ['variable.other.member.powershell'], sx.property),
    rule('PowerShell parameter',['keyword.operator.parameter.powershell', 'variable.parameter.powershell', 'support.variable.parameter.powershell'], sx.parameter),
    // C# (TextMate fallback before semantic tokens arrive)
    rule('C# property and event', ['entity.name.variable.property.cs', 'entity.name.variable.event.cs', 'variable.other.object.property.cs'], sx.property),
    rule('C# field and local', ['entity.name.variable.field.cs', 'entity.name.variable.local.cs', 'variable.other.readwrite.cs', 'variable.other.object.cs'], text.fg),
    rule('C# parameter', ['entity.name.variable.parameter.cs', 'variable.parameter.cs'], sx.parameter),
    rule('C# built-in types', ['keyword.type.cs', 'keyword.type.string.cs', 'keyword.type.int.cs', 'keyword.var.cs'], sx.keyword),
    rule('C# namespace', ['entity.name.type.namespace.cs', 'entity.name.namespace.cs'], text.muted),
  ];

  // Semantic tokens (C# via Roslyn, TypeScript, PowerShell...). Same roles as VS's Roslyn colors.
  const semanticTokenColors = {
    'namespace': text.muted,
    'module': text.muted,
    'type': sx.type,
    'class': sx.type,
    'recordClass': sx.type,
    'struct': sx.type,
    'recordStruct': sx.type,
    'interface': sx.type,
    'enum': sx.type,
    'delegate': sx.type,
    'typeParameter': sx.type,
    'function': sx.function,
    'method': sx.function,
    'extensionMethod': sx.function,
    'property': sx.property,
    'event': sx.property,
    'parameter': sx.parameter,
    'variable': text.fg,
    'local': text.fg,
    'field': text.fg,
    'enumMember': sx.number,
    'constant': sx.number,
    'label': sx.special,
    'keyword': sx.keyword,
    'controlKeyword': sx.keyword,
    'operator': sx.operator,
    'operatorOverloaded': sx.operator,
    'macro': sx.number,
    'decorator': sx.escape,
    'number': sx.number,
    'string': sx.string,
    'stringVerbatim': sx.string,
    'stringEscapeCharacter': sx.escape,
    'regexp': sx.string,
    'regexText': sx.string,
    'regexSelfEscapedCharacter': sx.string,
    'regexOtherEscape': sx.escape,
    'regexCharacterClass': sx.type,
    'regexAnchor': sx.special,
    'regexQuantifier': sx.number,
    'regexGrouping': sx.escape,
    'regexAlternation': sx.escape,
    'regexComment': sx.comment,
    'comment': sx.comment,
    'xmlDocCommentText': sx.comment,
    'xmlDocCommentDelimiter': text.lineNumber,
    'xmlDocCommentName': sx.comment,
    'xmlDocCommentAttributeName': sx.comment,
    'xmlDocCommentAttributeValue': sx.comment,
    'xmlDocCommentAttributeQuotes': sx.comment,
    'xmlDocCommentCDataSection': sx.comment,
    'xmlDocCommentComment': sx.comment,
    'xmlDocCommentEntityReference': sx.comment,
    'xmlDocCommentProcessingInstruction': sx.comment,
    'preprocessorText': text.fg,
    'excludedCode': text.lineNumber,
  };

  return json({
    $schema: 'vscode://schemas/color-theme',
    name: p.name,
    type: 'dark',
    semanticHighlighting: true,
    colors,
    tokenColors,
    semanticTokenColors,
  });
}

// ---------------------------------------------------------------------------
// Contrast report (WCAG 2 ratio against the editor background)
// ---------------------------------------------------------------------------
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

function report() {
  const rows = [['text.fg', text.fg], ['text.muted', text.muted], ['text.lineNumber', text.lineNumber],
    ...Object.entries(sx).map(([k, v]) => [`syntax.${k}`, v])];
  console.log(`\nContrast vs bg ${ui.bg} (4.5+ recommended for code text):`);
  for (const [k, v] of rows) {
    const r = contrast(v, ui.bg);
    const note = k === 'text.lineNumber' ? '  (UI only)' : r < 4.5 ? '  <-- low' : '';
    console.log(`  ${k.padEnd(20)} ${v}  ${r.toFixed(1).padStart(4)}${note}`);
  }
}

// ---------------------------------------------------------------------------
function json(o) { return JSON.stringify(o, null, 2) + '\n'; }

const outputs = {
  'zed/themes/kyokko.json': zed(),
  // Zed checks the license inside the extension directory, not at the repository root
  'zed/LICENSE': readFileSync(join(root, 'LICENSE.txt'), 'utf8'),
  'themes/windows-terminal/kyokko.json': windowsTerminal(),
  'vs/Kyokko.vstheme': vstheme(),
  'vscode/themes/kyokko-color-theme.json': vscode(),
  // vsce packs only files inside the extension directory
  'vscode/LICENSE': readFileSync(join(root, 'LICENSE.txt'), 'utf8'),
  'vscode/icon.png': readFileSync(join(root, 'vs/Resources/Icon.png')),
};

const check = process.argv.includes('--check');
let stale = [];
for (const [rel, content] of Object.entries(outputs)) {
  const file = join(root, rel);
  if (check) {
    if (!existsSync(file) || !readFileSync(file).equals(Buffer.from(content))) stale.push(rel);
    continue;
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  console.log(`wrote ${rel}`);
}
report();
if (check && stale.length) {
  console.error(`\nOut of date (run: node scripts/build.mjs):\n  ${stale.join('\n  ')}`);
  process.exit(1);
}
