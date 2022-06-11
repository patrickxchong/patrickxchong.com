---
title: Basics of Python Poetry
excerpt: 
status: draft
tags:
  - Tech
author: patrick-chong
date: 2020-05-12T02:31:10.530Z
image: /assets/images/uploads/scrabble.png
imageCardPosition: left-top
---

# Poetry

## Installation on Windows

```powershell
(Invoke-WebRequest -Uri https://raw.githubusercontent.com/python-poetry/poetry/master/install-poetry.py -UseBasicParsing).Content | python -
```

The installer installs the `poetry` tool to Poetry's `bin` directory. This location depends on your system:

- `$HOME/.local/bin` for Unix
- `%APPDATA%\Python\Scripts` on Windows

If this directory is not on your `PATH`, you will need to add it manually
if you want to invoke Poetry with simply `poetry`.

Alternatively, you can use the full path to `poetry` to use it.

Once Poetry is installed you can execute the following:

```powershell
poetry --version
```

If you see something like `Poetry (version 1.2.0)` then you are ready to use Poetry.
If you decide Poetry isn't your thing, you can completely remove it from your system
by running the installer again with the `--uninstall` option or by setting
the `POETRY_UNINSTALL` environment variable before executing the installer.

```powershell
python install-poetry.py --uninstall
POETRY_UNINSTALL=1 python install-poetry.py
```

## Updating `poetry`

Updating Poetry to the latest stable version is as simple as calling the `self update` command.

```bash
poetry self update
```

Poetry versions installed using the now deprecated `get-poetry.py` installer will not be able to use this
command to update to 1.2 releases or later. Migrate to using the `install-poetry.py` installer or `pipx`.

If you want to install pre-release versions, you can use the `--preview` option.

```bash
poetry self update --preview
```

And finally, if you want to install a specific version, you can pass it as an argument
to `self update`.

```bash
poetry self update 1.2.0
```



https://python-poetry.org/docs/basic-usage/



Source: 
- https://python-poetry.org/docs/#windows-powershell-install-instructions
- https://raw.githubusercontent.com/python-poetry/poetry/master/docs/_index.md




