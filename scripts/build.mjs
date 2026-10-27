// Generates every Kyokko theme file from palette.json.
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
// Zed  (themes/zed/kyokko.json)
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
  'themes/zed/kyokko.json': zed(),
  'themes/windows-terminal/kyokko.json': windowsTerminal(),
  'vs/Kyokko.vstheme': vstheme(),
};

const check = process.argv.includes('--check');
let stale = [];
for (const [rel, content] of Object.entries(outputs)) {
  const file = join(root, rel);
  if (check) {
    if (!existsSync(file) || readFileSync(file, 'utf8') !== content) stale.push(rel);
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
