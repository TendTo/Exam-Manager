# Add makeglossaries to the list of commands
add_cus_dep('glo', 'gls', 0, 'run_makeglossaries');
add_cus_dep('acn', 'acr', 0, 'run_makeglossaries');

# Clean up the temporary files after running latex, pdflatex,
push @generated_exts, 'glo', 'gls', 'glg';
push @generated_exts, 'acn', 'acr', 'alg';
$clean_ext .= ' %R.ist %R.xdy';

sub run_makeglossaries {
    my ($base_name, $path) = fileparse( $_[0] ); #handle -outdir param by splitting path and file, ...
    pushd $path; # ... cd-ing into folder first, then running makeglossaries ...

    if ( $silent ) {
        if ( "$^O" eq "MSWin32" ) {
            system "makeglossaries", "-q", "$base_name";
        } else {
            system "makeglossaries -q $base_name";
        }
    }
    else {
        if ( "$^O" eq "MSWin32" ) {
            system "makeglossaries", "$base_name";
        } else {
            system "makeglossaries $base_name";
        }
    };

    popd; # ... and cd-ing back again
}