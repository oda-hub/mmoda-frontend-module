# Description and installation

|||
| :-- | :-- |
|||

## Description

MMODA is the frontend of the CDCI Online Data Analysis system.  
MMODA stands for Mu^lti-Mission Online Data Analysis.

MMODA is developed as a set of Drupal modules (Drupal version 7).
[Drupal](https://www.drupal.org/) is a Content Management System (CMS).

MMODA pre-requisites are :

\- [Drupal 7 core](https://www.drupal.org/project/drupal),

\- a set of Drupal modules,

\- a set of external libraries, and  
\- a theme : the look and feel of a Drupal web site.

## Drupal modules

\- [CKEditor](https://www.drupal.org/project/ckeditor) :
[CKEditor](https://ckeditor.com/) is an online rich text editor
(WYSIWYG) that can be embedded inside web pages.

\- [Insert](https://www.drupal.org/project/insert) : this module makes
possible the inserting of images and links into the body field and other
WYSIWYG editors or text areas.  
\- [TOC Node](https://www.drupal.org/project/toc_node) : provides a
Table Of Contents for a node page, which includes all the headings of
the page content.  
the above three modules allow the edition of the help pages

\- [Node export](https://www.drupal.org/project/node_export) : allows
the export of nodes and their import into another Drupal installation,
or on the same instance.

\- [Universally Unique IDentifier](https://www.drupal.org/project/uuid)
(required by node export) :https://www.drupal.org/project/uuid :
provides an API for adding universally unique identifiers (UUID) to
Drupal objects, most notably entities.  
\- [Features](https://www.drupal.org/project/features) (required by node
export) : enables the capture and management of features in Drupal. A
feature is a collection of Drupal entities which taken together satisfy
a certain use-case.  
the above three modules make the help pages installable(uninstallable)
at install(uninstall) time

\- [Libraries API](https://www.drupal.org/project/libraries) (required
by mmoda): provides integration of external libraries (usually 3rd
party libraries)  
The list of 3rd party libraries used by mmoda is listed below

\- [jQuery Update](https://www.drupal.org/project/jquery_update) :
upgrades the version of [jQuery](https://jquery.com/) in Drupal core to
a newer version of jQuery, a JavaScript library.

\- [Administration menu](https://www.drupal.org/project/admin_menu) :
provides a theme-independent administration interface (“navigation”,
“back-end”). It’s a helper for novice users coming from other CMS, a
time-saver for site administrators, and useful for developers and site
builders.  
\- [Module Filter](https://www.drupal.org/project/module_filter)
(optional module, for comfort only) : allows the filtering of the list
of modules to be displayed in the administration module page.

All those modules including MMODA ones are sitting in the additional
Drupal modules directory:

    sites/all/modules

## Drupal theme

Many [free themes](https://www.drupal.org/project/project_theme) are
provided by Drupal community.  
The Drupal theme [Bootstrap](https://www.drupal.org/project/bootstrap)
has been selected for MMODA as it provides an excellent look and feel
and the [Bootstrap toolkit](https://getbootstrap.com/) provides a full
set of functionalities needed for MMODA.  
Following good practice recommendations, instead of changing the
Bootstrap theme for MMODA needs, a sub-theme derived from it has been
created: “Bootstrap MMODA”.  
Both themes are of course sitting in the additional Drupal themes
folder:

    sites/all/themes

Drupal community theme:

    sites/all/themes/bootstrap

MMODA dedicated theme:

    sites/all/themes/bootstrap_mmoda

## External libraries

\- CKEditor : [CKEditor](https://ckeditor.com/) is an online rich text
editor (WYSIWYG) that can be embedded inside web pages.

\- [Bootstrap form
validator](https://plugins.jquery.com/bootstrapValidator/) : A jQuery
plugin to validate form fields dedicated for Bootstrap toolkit.

\- [DataTables](https://datatables.net/) : a jQuery plugin adding
advanced features to any HTML table.  
\- [Bokeh](https://bokeh.pydata.org/en/latest/) : a JavaScript
interactive visualization library used to display, images, spectra and
light curves

## MMODA modules

MMODA is composed of a set of modules : a core module and one module
per instrument.  
Adding a new instrument in MMODA would consist on adding a new
module. Any instrument can be enabled/disabled by enabling/disabling the
corresponding module.  
Each instrument has a weight which is used to sort instrument
tabulations.

Current list of modules:

  - mmoda : a core module providing all necessary functionalities to
    query data products (images, spectra and light curves) and display
    them within interactive tools.
  - mmoda\_isgri : [INTEGRAL
    ISGRI](https://www.isdc.unige.ch/integral) module 
  - mmoda\_jemx : [INTEGRAL
    JEM-X](https://www.isdc.unige.ch/integral) module 
  - mmoda\_polar : [Polar](https://www.astro.unige.ch/polar/) module 
  - mmoda\_spi\_acs : [INTEGRAL SPI
    ACS](https://www.isdc.unige.ch/integral) module 
  - mmoda\_multiproduct (under development)

## Installation

While it is possible to install the module MMODA and its sub-modules
as any other Drupal modules given the required modules and the theme
Bootstrap listed above, an already Drupal instance is available in the
[Astro GitLab](https://gitlab.astro.unige.ch/cdci/frontend). Four
components are available in GitLab:

  - drupal7-for-mmoda : a Drupal instance including the required
    modules and the theme Bootstrap
  - drupal7-db-for-mmoda : a dump of the MySQL database of the cited
    Drupal instance drupal7-for-mmoda
  - bootstrap\_mmoda : the Bootstrap sub-theme dedicated for MMODA
  - mmoda : the module mmoda and its submodules, one per
    instrument, mmoda\_isgri, mmoda\_jemx, mmoda\_polar,
    mmoda\_spi\_acs and mmoda\_multiproduct

### Installation steps

1.  Copy the content of the folder drupal7-for-mmoda in the web
    server document root.
2.  Create a MySQL database called ‘mmoda’ and a database user
    ‘mmoda’ with the password defined in the file:
        sites/default/settings.php
3.  Grant all the database priviledges to the user ‘mmoda’
4.  Copy the folder bootstrap\_mmoda in :
        sites/all/themes
      
    with the provided database, this theme is already set as the default
    theme. 
5.  Copy the folder mmoda in :
        sites/all/modules
6.  Enable the core module :
        drush en mmoda
7.  Before installing the instrument modules, set the Drupal variable
    mmoda\_base\_url to the base URL (or the web site prefixe) if the
    Drupal instance is not the document root of the web server. In other
    words, if Drupal is not installed in ‘/’ but in ‘/blabla’, the
    Drupal variable mmoda\_base\_url must be set as follows:
        drush vset mmoda_base_url '/blabla'
      
    This is very important for the instrument help pages. The images
    appearing in the instrument help pages are stored in :
        sites/default/files
      
    But if the Drupal instance is under ‘/blabla’, the image URLs in the
    instrument help pages should point to:
        blabla/sites/default/files
      
    Given this variable, those URLs will be properly set.
8.  Enable the desired instrument modules, example :
        drush en mmoda_isgri mmoda_jemx
