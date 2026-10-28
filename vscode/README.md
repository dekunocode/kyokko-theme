# Kyokko Theme

**Kyokko** (極光, *kyokkō*, "aurora") is a calm navy dark theme for Visual Studio Code, lit by aurora cyan and green.

![C# in Kyokko](https://raw.githubusercontent.com/dekunocode/kyokko-theme/main/vscode/images/csharp.png)

## Highlights

- **Navy, not gray.** The whole window is themed: the title, activity and status bars, side bar, tabs, panels, menus, pickers, inputs and notifications use navy surfaces one step apart.
- **Readable colors.** Every code color is 5.9:1 or higher against the background (WCAG AA).
- **Plain comments.** Nothing is italic, so comments in Japanese and other CJK languages stay easy to read.
- **States that keep their meaning.** Errors stay red and warnings stay gold. Find matches and the paused line use a dark gold, and the status bar turns dark red while debugging. Light text on those lines stays readable.

## Languages

Semantic highlighting is on. With the C# extension, properties, events and parameters are teal, while fields and locals stay plain text, the same as Kyokko for Visual Studio 2026. XAML, XML, HTML, CSS, JSON, Markdown, PowerShell and TypeScript are colored with the same roles.

![HTML and the terminal in Kyokko](https://raw.githubusercontent.com/dekunocode/kyokko-theme/main/vscode/images/html.png)

## Debugging

![Debugging in Kyokko](https://raw.githubusercontent.com/dekunocode/kyokko-theme/main/vscode/images/debugging.png)

## Palette

| Role | Color |
| --- | --- |
| Background / surface / selection | `#0f1c2e` / `#16263b` / `#24425e` |
| Text / comment | `#d4e4ec` / `#7f9bb0` |
| Keyword / function / type | `#56b6c6` / `#7ee8a8` / `#7cc4f8` |
| String / number | `#e6d9a2` / `#b9a3f0` |
| Property, parameter | `#9fd9d0` |

The terminal uses the same 16 ANSI colors as Kyokko for Windows Terminal. VS Code lightens ANSI black on its own when `terminal.integrated.minimumContrastRatio` is above its contrast; set it to `1` to see the palette as is.

## Getting started

After installing, open **File > Preferences > Theme > Color Theme** (`Ctrl+K Ctrl+T`) and choose **Kyokko**.

The same palette is available for Visual Studio 2026, Zed and Windows Terminal on [GitHub](https://github.com/dekunocode/kyokko-theme).

## Feedback

Please report issues and suggestions on [GitHub](https://github.com/dekunocode/kyokko-theme/issues).
