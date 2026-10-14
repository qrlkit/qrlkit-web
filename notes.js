// Edit each note here: its filename, opening state, and the exact text to display.
// Order here is also the order in the Browse menu. Copy a block to add a note.
// No config generation or later overrides: what you write is what readers see.
const NOTES = [
  {
    file: 'how-it-started.md',
    open: false,
    featured: true,
    source: `
# How it started 

Back in September 2026, it was a day like any other.
I was debugging something that required me to work
in multiple windows at once: my tmux, a browser and
an admin tool. This endless going back and forward, 
having to exit my terminal and use my mouse (ew) to 
click-navigate through logs and the admin tool (with 
multiple windows scattered all over the place), was
draining me in way. 

And that day i realized what it was. You can probably
guess it had something to do with spreading your 
attention to thin, context switching etc. etc. And you
would be right, but i want to be more specific: 

**it was the endless recuring pauses**.

Between making progress on each little sub-quest 
(reading this function, this log, this config etc) 
i had to get of the "thought-train" and stop to find 
out where to go next. Well not exactly - i almost 
knew instantly *where to go* - but then navigating 
to that place (especially outside the terminal) was 
almost a task in it self. Thats what felt draining 
that day. 

There is no removing the pauses completely, but 
they could be *smoothed* some amount. I wanted all
these key resources at the tips of my fingers, in
my terminal, much like a normal CLI tool, so i could
quickly just type "logs live that-service" and that
would take me there with no additional clicking. 

I also realised that coding a custom CLI tool just 
for that purpose would not scale well. Any time
i would want to expand it - i would have to code
some more. So instead, the right solution felt more 
like keeping the key resources in lists and then
build a tool that could convert those lists into 
CLI tool calls.

Thats how it started. 

Eventually those lists turned into config files such
that special behaviors like custom hooks for opening
specific files or dirs, quickly running scripts or 
selecting specific browsers for specific bookmarks 
was possible. The term "Quick Resource Locator" was 
just an analog to Unique Resource Locators (URLs)
and the postfix "kit" was added to it: qrlkit.

The tool is available to anyone on github and its
pretty simple. What i like most about it is how
easy it is to add new resources and thus smooth out
even more things. Its pretty addicting for someone
like me. Maybe someone like you. 

Hope it helps, check it out:
https://github.com/qrlkit/qrlkit-rs

`,
  },
  {
    file: 'qrlkit-cmds.toml',
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
    file: 'install.toml',
    open: false,
    source: `# Installing qrlkit is now pretty easy

# Package managers
$ cargo install qrlkit
$ npm i -g qrlkit
$ bun add -g qrlkit
$ yarn global add qrlkit

# Latest Linux or macOS release
$ curl -fsSL https://raw.githubusercontent.com/qrlkit/qrlkit-rs/main/install.sh | sh

# Build from source
$ git clone git@github.com:qrlkit/qrlkit-rs.git
$ cd qrlkit-rs
$ cargo install --path .
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
"run" = """
helm upgrade --install scaleapp ~/dev/scaleapp/helm/$1/release.yaml
"""

# And $@ to parse complete list of args user gave
[scripts.pr]
"run" = 'gh pr create "$@"'
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
"filehook" = "nvim $file"

# Same kind of things for dirs. By default we cd into them
# but user should be able to do more like:
[repo]
blog = "~/blog"
notes = "~/notes"
"dirhook" = "cd $dir && tree -L 1 ."

# Links are opens in the browser choosen at qrlkit init
# Sometimes certain pages only run on som browsers
# so user should be able to do something like

[webtools]
timereg = "https://hr.internal.org/app"
"$browser" = "Chrome"

# Each of these should be local overwrites to
# global default values set by user with
qrlkit set-filehook "nvim $file"
qrlkit set-dirhook "cd $dir && tree -L 1"
qrlkit set-browser "Chrome"
`,
  },
];
