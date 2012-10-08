using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace RFC_Reader
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        public MainPage()
        {
            this.InitializeComponent();
        }

        /// <summary>
        /// Invoked when this page is about to be displayed in a Frame.
        /// </summary>
        /// <param name="e">Event data that describes how this page was reached.  The Parameter
        /// property is typically used to configure the page.</param>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            InputScope scope = new InputScope();
            InputScopeName name = new InputScopeName();

            name.NameValue = InputScopeNameValue.Number;
            scope.Names.Add(name);

            textBox1.InputScope = scope;
        }
        private void button1_Click(object sender, RoutedEventArgs e)
        {
            string site;
            site = textBox1.Text.Trim();
            double Num;
            bool isNum = double.TryParse(site, out Num);
            if (site.Length != 4 || !isNum)
            {
                var msg = new Windows.UI.Popups.MessageDialog("Enter a valid 4-digit Doc ID");
                msg.ShowAsync();
            }

            else
            {
                site = "http://docs.google.com/viewer?url=http://tools.ietf.org/pdf/rfc" + site + ".pdf&embedded=true";
                wv.Source = new Uri(site, UriKind.Absolute);
            }
        }
    }
}
