// Edit each note here: its filename, opening state, and the exact text to display.
// Order here is also the order in the Browse menu. Copy a block to add a note.
// No config generation or later overrides: what you write is what readers see.
const NOTES = [
  {
    file: 'could-be-cool.toml',
    open: false,
    featured: true,
    source: `# <+> main idea <+>
# qrlkit turns file --> cli tool
# 1. Use config files to track booksmarks, snippets, shortcuts
# 2. Run qrlkit to turn keys and values in files into small cli tools
# 3. Only change config files for new behavior (auto updates)

# Imagine we just type "docs cli" or "docs wiki teams" in 
# terminal and it opens in browser by mapping keys to urls

[docs]
cli = "https://notion.so/CLI-guide-8e16b3a947c24f20a1d098c63b52ef74"
ref = "https://notion.so/Reference-2c97d5e813a64b09b4f160d82e7a395c"

[docs.wiki]
teams = "https://notion.so/Teams-6a30c8f129d74e52a9b4061d83e7fc25"
design-guide = "https://notion.so/Teams-947c24f20a1d094061d834061d83e733"

# but we ALSO add dirs or files and just jump there when called
notes = "~/home/notes"
desk = "~/Desktop"
dev = "~/dev"

# Uh or even put small tricks / scrips in there like "notes todo"
[notes.todo]
$run = """
path = ~/home/notes/todo.md
sed -i "1i# $(date '+%Y-%m-%d %H:%M:%S')" $path
nvim $path
"""
`,
  },
  {
    file: 'nesting.toml',
    open: false,
    source: `# Actually for logs having nesting would be very very use full
# So for like "logs backend prod nginx" we would use keys like so:

[logs]
[logs.backend.prod]
'api-server' = "https://logs.internal/app/discover#/view/a7f3c920"
'nginx' = "https://logs.internal/app/discover#/view/9d21b6e4" # 
'cache' = "https://logs.internal/app/discover#/view/c840f17a"
'db' = "https://logs.internal/app/discover#/view/62be09d3"
'cdn' = "https://dash.cloudflare.com/8f3a91c2d7e640b5a02c6e914db873fa/analytics"

[logs.backend.staging]
'api-server' = "https://logs.internal/app/discover#/view/f19a4c72"
'nginx' = "https://logs.internal/app/discover#/view/30d8e5b1"
'cache' = "https://logs.internal/app/discover#/view/b67c02f9"

# And we can even store misc random queries
[logs.misc.live]
http500s = "https://logs.internal/app/discover#/view/e2409a6d"
https404 = "https://logs.internal/app/discover#/view/7cb18f03"
exceptions = "https://logs.internal/app/discover#/view/4a96d2e8"
failed-signups = "https://logs.internal/app/discover#/view/d5037bc1"

# and just run "logs misc live failed-signups" to quickly find logs
`,
  },
  {
    file: 'qrlkit-basics.toml',
    open: false,
    source: `# See installed QRLs
$ qrlkit

# Browse or open a resource
$ qrlkit [keys...]

# Add a QRLs file (toml, yaml, json should be supported)
$ qrlkit add <path>

# List registered config files
$ qrlkit ls

# Unregister a config, but keep the file
$ qrlkit rm <path>

# Refresh imports and retry directory setup
$ qrlkit reload

# Choose a browser
$ qrlkit set-browser

# Print shell integration for manual setup
$ qrlkit init <shell>

# Reset imports, renames, and browser selection
$ qrlkit nuke

# Show help
$ qrlkit --help
`,
  },
  {
    file: 'using-inputs.toml',
    open: false,
    source: `# Providing inputs to tools could be gold..
# syntax should enable variables in {} that users can provide..

[stats]
platform = "https://{subdomain}.stats.platform/{service}"

[search]
google = "https://google.com?q={input}"
chatgpt = "https://chatgpt.com/?q={input}"

# Same in dirs and file paths
[helm]
release = "~/dev/scaleapp/helm/{package}/release.yaml"

[config]
dotfiles = "~/.config/{tool}"

# Scripts should support normal shell syntax with $1 $2 $3 etc
[scripts]
[scripts.release]
"$run" = """
helm upgrade --install scaleapp ~/dev/scaleapp/helm/$1/release.yaml
"""

# And $@ to parse complete list of args user gave
[scripts.pr]
"$run" = 'gh pr create "$@"'
`,
  },
  {
    file: 'customize.toml',
    open: false,
    source: `# User should be able customize behavior

# Files by default just print the path stored
# We should allow a filehook that does something else with a script
[dotfiles]
nvim = '~/.config/nvim/init.lua'
tmux = '~/.config/tmux/.tmux.config'
"$filehook" = "nvim file"

# Same kind of things for dirs. By default we cd into them
# but user should be able to do more like:
[repo]
blog = "~/blog"
notes = "~/notes"
"$dirhook" = "cd dir && tree -L 1 ."

# Links are opens in the browser choosen at qrlkit init
# Sometimes certain pages only run on som browsers
# so user should be able to do something like

[webtools]
timereg = "https://hr.internal.org/app"
"$browser" = "Chrome"

# Each of these should be local overwrites to
# global default values set by user with
qrlkit set-filehook "nvim file"
qrlkit set-dirhook "cd dir && tree -L 1"
qrlkit set-browser "Chrome"
`,
  },
];
