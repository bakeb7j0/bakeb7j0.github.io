---
title: "Projects"
permalink: /projects/
layout: single
author_profile: true
---

A showcase of my work and projects.

{% for project in site.data.projects %}
## {{ project.name }}

{% if project.image %}
![{{ project.name }}]({{ project.image }})
{% endif %}

{{ project.description }}

{% if project.link %}
[View Project]({{ project.link }}){: .btn .btn--primary}
{% endif %}

---

{% endfor %}
