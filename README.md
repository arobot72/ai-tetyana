# Система управления агентами — v3.0

## Структура

```
.opencode/
  agents/
    orchestrator.md   ← primary agent (Claude, управляет всем)
    oc-planner.md     ← subagent, hidden (генерирует Path)
    oc-writer.md      ← subagent, hidden (Spec + Backlog)
    oc-coder.md       ← subagent, hidden (реализация)
    oc-tester.md      ← subagent, hidden (тесты + Object_State)
    oc-critic.md      ← subagent, hidden (анализ Deviation)
  skills/
    oc-rules/
      SKILL.md        ← правила системы, загружаются по требованию

ops/
  _template.md        ← шаблон файла операции (OC)
  {module}.md         ← активный OC модуля (наблюдаемое состояние)

logs/
  oc_log.jsonl        ← лог событий (для донастройки)

opencode.json         ← конфигурация opencode
```

## Как запустить

```bash
# В корне проекта, куда скопированы эти файлы:
opencode
# Переключиться на orchestrator агент через Tab
# Написать задачу Stakeholder в чат
```

## Как наблюдать за работой

**В реальном времени:**
```bash
# Смотреть на файл операции конкретного модуля
watch cat ops/module_files.md

# Смотреть лог событий
tail -f logs/oc_log.jsonl | jq .
```

**Где застрял:**
```bash
# Найти все незакрытые вехи
grep -l "status: БИЛД" ops/*.md

# Посмотреть историю конкретного модуля
grep '"module":"files"' logs/oc_log.jsonl | jq .
```

**Паттерны ошибок (для донастройки агентов):**
```bash
# Какой шаг чаще всего падает
cat logs/oc_log.jsonl | jq -r 'select(.status=="fail") | .step' | sort | uniq -c | sort -rn

# Какие модули дают PATH_INVALID
cat logs/oc_log.jsonl | jq -r 'select(.note | contains("PATH_INVALID")) | .module'
```

## Параллельная работа

Orchestrator запускает независимые модули параллельно через Task tool.
Каждый модуль имеет свой файл `ops/{module}.md`.
Зависимые модули — строго последовательно.

## Донастройка

Всё в промптах агентов (`.opencode/agents/*.md`).
- Агент часто неправильно формирует Object_State → правь `oc-tester.md`
- Агент делает лишнее → добавь в раздел "ЧТО НИКОГДА НЕ ДЕЛАТЬ"
- Нужна другая модель для конкретного агента → меняй `model:` в frontmatter
- Нужно больше/меньше итераций → меняй `attempt_max` в правилах
